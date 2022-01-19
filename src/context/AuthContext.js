import { createContext, useReducer, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, cart: action.payload.cart, isPending: false, error: null };
    case 'SIGN_UP':
      return { ...state, isPending: false, error: null, user: action.payload.user }
    case 'LOGOUT':
      return { ...state, user: null, cart: [], isPending: false, error: null };
    case 'UPDATE_CART':
      return { ...state, cart: action.payload };
    case 'AUTH_IS_READY':
      return { user: action.payload.user, cart: action.payload.cart, authIsReady: true, isPending: false, error: null };
    case 'ERROR':
      return { user: null, cart: [], error: action.payload, isPending: false, authIsReady: false };
    case 'IS_PENDING':
      return { ...state, isPending: true };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const { data, error } = useFetch(`${process.env.REACT_APP_SERVER_URL}/user`);
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    cart: [],
    error: null,
    isPending: false,
    authIsReady: false
  });

  useEffect(() => {
    dispatch({ type: 'IS_PENDING' });

    if (data && !error) {
      if (!data.user) {
        const localItems = JSON.parse(localStorage.getItem('cart'));

        if (localItems) {
          const new_data = {
            user: data.user,
            cart: localItems
          }
          
          dispatch({ type: 'AUTH_IS_READY', payload: new_data });
        } else {
          localStorage.setItem('cart', JSON.stringify([]));
          dispatch({ type: 'AUTH_IS_READY', payload: data });
        }
      } else {
        dispatch({ type: 'AUTH_IS_READY', payload: data });
      }

    } else {
      if (error) {
        dispatch({ type: 'ERROR', payload: error });
      }
    }
    
  }, [data, error])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}
