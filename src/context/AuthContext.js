import { createContext, useReducer, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, cart: action.payload.cart };
    case 'LOGOUT':
      return { ...state, user: action.payload.user, cart: null };
    case 'AUTH_IS_READY':
      return { user: action.payload.user, cart: action.payload.cart, authIsReady: true };
    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const { data, error } = useFetch('http://localhost:5000/user');
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    // cart: null,
    authIsReady: false
  })

  useEffect(() => {
    if (data && !error) {
      dispatch({ type: 'AUTH_IS_READY', payload: data });
    }
  }, [data, error])

  console.log('State: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}
