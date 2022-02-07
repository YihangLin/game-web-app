import { setAuthIsPending, updateUser, setAuthError, setInitialError } from "../actions/userActions";
import { updateCart } from "../actions/cartActions";

const initialState = {
  user: null,
  authIsReady: false,
  initialError: null,
  authIsPending: false,
  authError: null
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { user: action.payload, authIsReady: true, authIsPending: false, authError: null, initialError: null };
    case 'SET_AUTH_ERROR':
      return { ...state, authIsPending: false, authError: action.payload, initialError: null };
    case 'SET_AUTH_IS_PENDING':
      return { ...state, authIsPending: true, authError: null, initialError: null };
    case 'SET_INITIAL_ERROR':
      return { ...state, initialError: action.payload };
    default:
      return state;
  }
}

export const initialGetUser = () => async (dispatch, getState) => {
  dispatch(setAuthIsPending());

  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user`, {
      credentials: 'include',
    });
    
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data);
    }

    if (!data.user) {
      const localItems = JSON.parse(localStorage.getItem('cart'));

      // update cart state if guest has items in localstorage
      if (localItems) {
        dispatch(updateCart(localItems));
      } else {
        // create empty cart in localstorage
        localStorage.setItem('cart', JSON.stringify([]));
        dispatch(updateCart(data.cart));
      }
    } else {
      // user has logged in, update cart state with cart fetched from database
      dispatch(updateCart(data.cart));
    }

    // update user state
    dispatch(updateUser(data.user));

  } catch (err) {
    dispatch(setInitialError(err.message));
  }
}

export const loginUser = (email, password) => async (dispatch, getState) => {
  dispatch(setAuthIsPending());

  try {
    const user = {
      email,
      password,
      cart: getState().cartReducer.cart
    }
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data);
    }

    // update user state and cart state
    dispatch(updateUser(data.user));
    dispatch(updateCart(data.cart));

    // items in localstorage have been added into database, clear localstorage
    localStorage.clear();

  } catch (err) {
    dispatch(setAuthError(err.message))
  }
}

export const signupUser = (email, password, name) => async (dispatch, getState) => {
  dispatch(setAuthIsPending());

  try {
    const user = {
      email,
      password,
      name,
      cart: getState().cartReducer.cart
    }
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data);
    }

    // update user state
    dispatch(updateUser(data.user));

    localStorage.clear();

  } catch (err) {
    dispatch(setAuthError(err.message));
  }
}

export const logoutUser = () => async (dispatch, getState) => {
  dispatch(setAuthIsPending());

  try {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      credentials: 'include',
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error('Failed to logout.')
    }

    console.log(data);
    dispatch(updateUser(null));
    dispatch(updateCart([]));

    // reset localstorage
    localStorage.setItem('cart', JSON.stringify([]));

  } catch (err) {
    dispatch(setAuthError(err.message));
  }
}