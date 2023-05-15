import * as ActionTypes from './ActionTypes';

export const collectUserInfo = (login) => (dispatch) => {
	dispatch(loginInfo(login));
}

export const loginInfo = (login) => ({
	type: ActionTypes.LOGIN_INFO,
	payload: login
});