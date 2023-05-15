import * as ActionTypes from './ActionTypes';

export const LoginReducer = (state = {
  login: {}
}, action) => {
switch (action.type) {
  case ActionTypes.LOGIN_INFO:
    return {...state, login: action.payload};

  default:
    return state;
}
};