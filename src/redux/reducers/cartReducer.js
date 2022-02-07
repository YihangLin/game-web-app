import { setCartIsPending, setCartError, updateCart } from "../actions/cartActions";

const initialState = {
  cart: [],
  cartIsPending: false,
  cartError: null
}


export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CART':
      return { cartIsPending: false, cartError: null, cart: action.payload };
    case 'SET_CART_IS_PENDING':
      return { ...state, cartError: null, cartIsPending: true };
    case 'SET_CART_ERROR':
      return { ...state, cartIsPending: false, cartError: action.payload };
    default:
      return state;
  }
}

export const updateCartAPI = (url, game) => async (dispatch, getState) => {
  dispatch(setCartIsPending());

  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        game: game
      }),
    },)

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data);
    }

    if (data.user) {
      // update cart state
      dispatch(updateCart(data.cart));
    } else {
      throw new Error('Session expired, please login again.');
    }

  } catch (err) {
    dispatch(setCartError(err.message));
  }
}