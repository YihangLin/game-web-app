export const updateCart = (cart) => {
  return {
    type: 'UPDATE_CART',
    payload: cart
  }
};

export const setCartError = (err) => {
  return {
    type: 'SET_CART_ERROR',
    payload: err
  }
};

export const setCartIsPending = () => {
  return {
    type: 'SET_CART_IS_PENDING',
  }
}