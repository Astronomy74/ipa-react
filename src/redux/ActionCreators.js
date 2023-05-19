import * as ActionTypes from './ActionTypes';
import { getFirestore, collection, getDoc, doc, query, where } from "firebase/firestore";

export const collectUserInfo = (login) => (dispatch) => {
	dispatch(loginInfo(login));
}

export const loginInfo = (login) => ({
	type: ActionTypes.LOGIN_INFO,
	payload: login
});


export const collectInternship = (login) => (dispatch) => {
	const db = getFirestore();
    const internshipsCollectionRef = collection(db, "internships");
    const docRef = doc(internshipsCollectionRef, login.email);
    const allInternshipsCollectionRef = collection(docRef, "all-internships");
    
        // Fetch internship1 and internship2 within the all-internships collection
        const internship1DocRef = doc(allInternshipsCollectionRef, "internship1");
        const internship2DocRef = doc(allInternshipsCollectionRef, "internship2");
        let internshipArray;
        Promise.all([getDoc(internship1DocRef), getDoc(internship2DocRef)])
          .then((results) => {
            const newData = [];
            results.forEach((doc) => {
              if (doc.exists()) {
                newData.push(doc.data());
              } else {
                console.log("Document does not exist.");
              }
            });
            return newData;
          })
          .then((newData) => dispatch(internshipInfo(newData)))
          .catch((error) => {
            console.log("Error getting documents:", error);
          });
      
	    
}

export const internshipInfo = (newData) => ({
	type: ActionTypes.INTERNSHIP_INFO,
	payload: newData
});