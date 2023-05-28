import * as ActionTypes from './ActionTypes';

export const InternshipReducer = (state = {
  internshipList: {}
}, action) => {
switch (action.type) {
  case ActionTypes.INTERNSHIP_INFO:
    return {...state, internshipList: action.payload};

  default:
    return state;
}
};