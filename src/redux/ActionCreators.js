import * as ActionTypes from './ActionTypes';
import { getFirestore, collection, getDoc, doc, query, where } from "firebase/firestore";

export const collectUserInfo = (login) => (dispatch) => {
	dispatch(loginInfo(login));
}

export const loginInfo = (login) => ({
	type: ActionTypes.LOGIN_INFO,
	payload: login
});

export const logoutFunc = () => (dispatch) => {
  dispatch(loginInfo({}));
}


