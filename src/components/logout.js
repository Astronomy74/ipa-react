import React, { } from "react";
import { getAuth } from "firebase/auth";



function Logout(props){
    const auth = getAuth();
    
    auth.signOut().then(() => {
<<<<<<< HEAD
    props.props.logout(); // clear user info 
=======
    props.props.loginCollect({}); // clear user info 
>>>>>>> origin/logoutComp
    }).catch((error) => {
    console.error(error);
    });

}

export default Logout;