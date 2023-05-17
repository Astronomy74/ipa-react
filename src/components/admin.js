import React from "react";
import NavBar from "./navBar";


function Admin(props){


    return(
        <main>
        <NavBar props={props}/>   
        <h1>Admin Dashboard</h1>
        </main>
    );

}

export default Admin;