import React, { } from "react";
import { getAuth } from "firebase/auth";



function Logout(props){
    const auth = getAuth();
    
    auth.signOut().then(() => {
    props.props.loginCollect({}); // clear user info 
    }).catch((error) => {
    console.error(error);
    });

}

export default Logout;