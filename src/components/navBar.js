import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";



function NavBar(props){
  
    const pfp = document.getElementById("pfp");

    const [pfpActive, pfpToggle] = useState('');
    
    function togglePfp(){
        if(!pfpActive){
            pfpToggle(true);
        }else {
            pfpToggle(false);
        }
    }

    const [bellActive, bellToggle] = useState('');
    
    function toggleBell(){
        if(!pfpActive){
            bellToggle(true);
        }else {
            bellToggle(false);
        }
    }

    
    // const bell = document.getElementById("bell");
    // const bellContainer = document.querySelector(".container.not");
    // const envelope = document.getElementById("envelope");
    // const msgs = document.querySelector(".msgs");
    // bell.addEventListener("click", () => {
    //     bellContainer.classList.toggle("active");
    // });   
    // envelope.addEventListener("click", () => {
    //     msgs.classList.toggle("active");
    // });   

    return(
        <div>
            <nav className={"navbar navbar-expand-lg fixed-top " + (document.documentElement.scrollTop > 200 ? 'noTransparrent' : '')} id="navbar">
            <div className="container">
                <div className="logo">
                <a className="navbar-brand" href="#">
                    <img src="../images/Uskudar_Universitesi_logo.png" alt="logo" />
                </a>
                </div>
                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="pages m-auto">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#dashBoard">Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#applyForJob">OpenJobs</a>
                    </li>
                    </ul>
                </div>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link" id="envelope"
                        ><i className="fa-solid fa-envelope"></i></a>
                    <div className="msgs">
                        <a href="new-msg.html"
                        ><span className="msg" id="sendMessage">Send Message</span></a>
                        <a href="incoming-message.html"
                        ><span className="msg" id="seeMessage">See Message</span></a>
                    </div>
                    </li>
                    <li className="nav-item bell" id="bell">
                    <a className="nav-link"><i className="fa-solid fa-bell"></i></a>
                    </li>
                </ul>

                <div className="user-info">
                    <span id="user-name"></span>
                    <div className="pfp-info">
                    <a id="pfp" onClick={togglePfp}><i className="fa-solid fa-circle-user fa-2x"></i></a>
                    <span id="pfp-span" className={"pfp-span " + (pfpActive? 'active' : '')} onClick={() =>Logout(props)}>Logout</span>
                    </div>
                </div>
                </div>
            </div>
            </nav>
        </div>
    );

}

export default NavBar;