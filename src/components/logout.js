import React, { } from "react";
import { getAuth } from "firebase/auth";



function Logout(props){
    const auth = getAuth();
    
    auth.signOut().then(() => {
    props.props.loginCollect(); // clear user info 
    window.location.href = '/login';
    console.log("User signed out");
    }).catch((error) => {
    console.error(error);
    });

}

export default Logout;