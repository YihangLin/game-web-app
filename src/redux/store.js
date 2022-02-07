import { combineReducers, createStore, applyMiddleware } from "redux";
import { userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import thunk from "redux-thunk";

const reducer = combineReducers({
  userReducer,
  cartReducer
})

const store = createStore(reducer, applyMiddleware(thunk));

export default store;