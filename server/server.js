require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const pool = require('pg').Pool;
const { Pool } = require('pg');
const cors = require('cors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME
})

const maxAge = 3 * 24 * 60 * 60;
const mySecret = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, mySecret, {
    expiresIn: maxAge
  });
}

//verify jwt token
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, mySecret, (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        return res.status(403).json(error)
      } else {
        req.user_id = decodedToken.id;
        next();
      }
    })
  } else {
    return res.json({
      user: null,
      cart: []
    })
  }
}

const updateDiscount = async (req, res, next) => {
  await db.query (
    'UPDATE discounts SET discount_percent = 0 WHERE discount_expires < now()'
  );
  next();
}

app.get('/homepage', updateDiscount, async (req, res) => {
  try {
    const featured = await db.query(
      'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) ORDER BY RANDOM() LIMIT 9'
      );
    
    const discount = await db.query(
      'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE discounts.discount_percent != 0 ORDER BY RANDOM() LIMIT 6'
    )
    res.json({
      newGame: featured.rows[0],
      popularGames: [featured.rows[1], featured.rows[2], featured.rows[3], featured.rows[4], featured.rows[5], featured.rows[6]],
      saleGames: discount.rows,
      recentlyUpdated: [featured.rows[7], featured.rows[8]]
    })

  } catch (err) {
    console.error('Homepage game data error', err.message);
    res.status(400).json(err);
  }
})

//return the detial of the game with that id
app.get('/games/:id', updateDiscount, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM games INNER JOIN min_requirements ON (games.game_id = min_requirements.min_requirement_game_id) INNER JOIN rec_requirements ON (games.game_id = rec_requirements.rec_requirement_game_id) INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE games.game_id = $1', [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error retrieving game detail: ', err.message);
    res.status(400).json(err);
  }
})

//return games with that category tag
app.get('/category/:category', updateDiscount, async (req, res) => {
  const { category } = req.params;
  try {
    switch(category) {
      case 'allgames':
        const result_allgames = await db.query(
          'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id)'
        );
        return res.json({ games: result_allgames.rows });
      case 'sales':
        const result_sales = await db.query(
          'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE discounts.discount_percent != 0'
        );
        return res.json({ games: result_sales.rows });
      default:
        const result = await db.query(
          'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE $1 = ANY(games.game_category)', [category]
        );
        return res.json({ games: result.rows });
    }
  } catch (err) {
    console.error('Error retrieving games in category: ', err.message);
    res.status(400).json(err);
  }
})

app.post('/signup', async (req, res) => {
  const { name, email, password, cart } = req.body;

  try {
    const result = await db.query(
      'SELECT EXISTS(SELECT user_email FROM users WHERE user_email = $1)', [email]
    );

    if (result.rows[0].exists) {
      return res.status(409).end();
    }

    const salt = await bcrypt.genSalt();
    const hased_password = await bcrypt.hash(password, salt);

    const register_user_result = await db.query(
      'INSERT INTO users(user_email, user_password, user_name) VALUES ($1, $2, $3) RETURNING user_id, user_name', [email, hased_password, name]
    );

    if (!register_user_result.rows[0]) {
      return res.status(500).end;
    }

    //update users cart if thare are games in cart
    if (cart && cart.length !== 0) {
      const register_cart_result = await db.query(
        'INSERT INTO carts(cart_user_id, cart_items) VALUES ($1, $2) RETURNING *', [register_user_result.rows[0].user_id, cart]
      );

      if (!register_cart_result.rows[0]) {
        return res.status(500).end;
      }

      console.log('Cart created for user: ', name);
      console.log('Cart ID: ', register_cart_result.rows[0].cart_id);
      console.log('Items added to cart: ', register_cart_result.rows[0].cart_items);
    } else {

      const register_cart_result = await db.query(
        'INSERT INTO carts(cart_user_id) VALUES ($1) RETURNING *', [register_user_result.rows[0].user_id]
      );

      if (!register_cart_result.rows[0]) {
        return res.status(500).end();
      }

      console.log('Cart created for user: ', name);
      console.log('Cart ID: ', register_cart_result.rows[0].cart_id);
      
    }

    const token = createToken(register_user_result.rows[0].user_id);

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    return res.json({
      user: register_user_result.rows[0],
    })
    
  } catch (err) {
    console.log('Sign up Error: ', err.message);
    res.status(400).json(err);
  }
})

app.post('/login', async (req, res) => {
  const { email, password, cart } = req.body;

  try {
    const result_exist = await db.query(
      'SELECT EXISTS(SELECT user_email FROM users WHERE user_email = $1)', [email]
    );

    if (!result_exist.rows[0].exists) {
      return res.status(404).end();
    }

    const result_user = await db.query(
      'SELECT user_id, user_name, user_password FROM users WHERE user_email = $1', [email]
    );

    if (!result_user.rows[0]) {
      return res.status(500).end();
    }

    const auth = await bcrypt.compare(password, result_user.rows[0].user_password);

    if (!auth) {
      return res.status(401).end();
    }

    const token = createToken(result_user.rows[0].user_id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    //update cart if there are games in cart
    if (cart && cart.length !== 0) {
      const result_cart = await db.query(
        'UPDATE carts SET cart_items = ARRAY(SELECT DISTINCT UNNEST(array_cat(cart_items, $1))) WHERE cart_user_id = $2 RETURNING cart_items', [cart, result_user.rows[0].user_id]
      );

      if (!result_cart.rows[0]) {
        return res.status(500).end();
      }

      res.json({
        user: {
          user_name: result_user.rows[0].user_name,
          user_id: result_user.rows[0].user_id
        },
        cart: result_cart.rows[0].cart_items
      })
    } else {
      const result_cart = await db.query(
        'SELECT cart_items FROM carts WHERE cart_user_id = $1', [result_user.rows[0].user_id]
      );

      if (!result_cart.rows[0]) {
        return res.status(500).end();
      }

      res.json({
        user: {
          user_name: result_user.rows[0].user_name,
          user_id: result_user.rows[0].user_id
        },
        cart: result_cart.rows[0].cart_items
      })
    }

  } catch (err) {
    console.log('Login Error: ', err.message);
    res.status(400).json(err);
  }

})

//return the current logged in user
app.get('/user', requireAuth, async (req, res) => {
  
  const { user_id } = req;

  try {
    const result = await db.query(
      'SELECT user_name, user_id, cart_items FROM users INNER JOIN carts ON users.user_id = carts.cart_user_id WHERE users.user_id = $1', [user_id]
    );
    
    return res.json({
      user: {
        user_name: result.rows[0].user_name,
        user_id: result.rows[0].user_id
      },
      cart: result.rows[0].cart_items
    })

  } catch (err) {
    console.log('Error gettting logged in user info', err.message);
    res.status(404).json(err);
  }

})

app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });

  console.log('Logout');

  res.json('Logout successfully');
})

// return games in cart
app.post('/cart', updateDiscount, async (req, res) => {
  const { cart } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE games.game_id = ANY($1)', [cart]
    );

    if (!result.rows) {
      return res.status(404).end();
    }

    res.json({
      games: result.rows
    })

  } catch (err) {
    console.log('Retrieving game details in cart error: ', err.message);
    res.status(400).json(err);
  }
})


//update cart when users add new game to it
app.put('/add', requireAuth, async (req, res) => {
  const { game } = req.body;

  try {
    const result = await db.query(
      'UPDATE carts SET cart_items = array_append(cart_items, $1) WHERE cart_user_id = $2 RETURNING cart_user_id, cart_items', [game, req.user_id]
    );

    if (!result.rows[0]) {
      return res.status(500).end();
    }

    res.json({
      user: result.rows[0].cart_user_id,
      cart: result.rows[0].cart_items
    })
  } catch (err) {
    console.log('Adding item to cart error: ', err.message);
    res.status(400).json(err);
  }
})


//update the cart when users remove a game
app.put('/remove', requireAuth, async (req, res) => {
  const { game } = req.body;

  try {
    const result = await db.query(
      'UPDATE carts SET cart_items = array_remove(cart_items, $1) WHERE cart_user_id = $2 RETURNING cart_user_id, cart_items', [game, req.user_id]
    );

    if (!result.rows[0]) {
      return res.status(500).end();
    }

    console.log('DELETE game from cart');
    console.log(result.rows[0]);

    res.json({
      user: result.rows[0].cart_user_id,
      cart: result.rows[0].cart_items 
    })

  } catch (err) {
    console.log('Removing item from cart error: ', err.message);
    res.status(400).json(err);
  }
})

app.get('/search', updateDiscount, async (req, res) => {
  const { q } = req.query;

  try {
    const result = await db.query(
      'SELECT * FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE games.game_name ILIKE $1', ['%' + q + '%']
    );

    res.json({
      games: result.rows,
    })

  } catch (err) {
    console.log('Search error', err.message);
    res.status(400).json(err);
  }
})

//stripe checkout
app.post('/checkout', requireAuth, async (req, res) => {
  const { cart } = req.body;
  const { user_id } = req;

  try {
    const result = await db.query(
      'SELECT games.game_id, games.game_name, games.game_price, games.game_display_img, discounts.discount_id, discounts.discount_game_id, discounts.discount_percent FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE games.game_id = ANY($1)', [cart]
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items:  result.rows.map(item => {
        const finalPrice = Math.round(item.game_price * (100 - item.discount_percent) / 100);
        return {
          price_data: {
            currency: 'cad',
            product_data: {
              images: [item.game_display_img],
              name: item.game_name,
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        }
        
      }),

      client_reference_id: user_id,
      success_url: `${process.env.HOST_URL}/success?q={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOST_URL}/failure`
    })

    res.json({
      url: session.url,
    })

  } catch (err) {
    console.log('Check out error: ', err.message);
    res.status(500).json(err);
  }
})


//update orders table in database, and clear games in cart for successful payment
app.get('/success', async (req, res) => {
  if (req.query.q) {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.q);

      const results = await db.query(
        'SELECT games.game_id, games.game_name, games.game_price, games.game_display_img, discounts.discount_id, discounts.discount_game_id, discounts.discount_percent FROM games INNER JOIN discounts ON (games.game_id = discounts.discount_game_id) WHERE games.game_id = ANY(ARRAY(SELECT cart_items FROM carts WHERE cart_user_id = $1))', [session.client_reference_id]
      );

      const orderHistory = results.rows.map(result => {
        const finalPrice = Math.round(result.game_price * (100 - result.discount_percent) / 100);
        return {
          'game_name': result.game_name,
          'game_price': finalPrice,
          'game_display_img': result.game_display_img
        }
      })

      const orderHistoryJSON = JSON.stringify(orderHistory);

      const orderResults = await db.query(
        'INSERT INTO orders(order_user_id, order_games) VALUES ($1, $2) RETURNING order_id', [session.client_reference_id, orderHistoryJSON]
      );

      console.log('Order added: ', orderResults.rows[0].order_id);

      const clearCarts = await db.query(
        'UPDATE carts SET cart_items = ARRAY[]::integer[] WHERE cart_user_id = $1 RETURNING cart_id', [session.client_reference_id]
      )

      console.log('Updated cart: ', clearCarts.rows[0].cart_id);

      res.json('Thank you for your order! Visit your account order history for more info.');
    } catch (err) {
      console.log('Retrieve checkout session error: ', err.message);
      res.status(500).json(err);
    }
  } else {
    res.status(400).json('No session ID');
  }
})

//return users order history
app.get('/orders', requireAuth, async (req, res) => {
  const { user_id } = req;

  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE order_user_id = $1 ORDER BY order_complete_time DESC', [user_id]
    );

    res.json({
      orders: result.rows
    })

  } catch (err) {
    console.log('Retrieve orders error: ', err.message);
    res.status(500).json(err);
  }
})

app.listen(5000, () => {
  console.log('Server is running on port 5000.');
})

