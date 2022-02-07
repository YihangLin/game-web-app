export const updateUser = (user) => {
  return {
    type: 'UPDATE_USER',
    payload: user
  }
};

export const setAuthError = (err) => {
  return {
    type: 'SET_AUTH_ERROR',
    payload: err
  }
}

export const setAuthIsPending = () => {
  return {
    type: 'SET_AUTH_IS_PENDING',
  }
}

export const setInitialError = (err) => {
  return {
    type: 'SET_INITIAL_ERROR',
    payload: err
  }
}