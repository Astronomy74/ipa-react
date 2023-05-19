import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

// NavBar style
import "../css/navBar.css";

function NavBar(props) {
  
  const msgsRef = useRef(null); // define a useRef hook for the msgs element
  const logoutRef = useRef(null);
  const bellRef = useRef(null);
  


  const [pfpActive, pfpToggle] = useState("");
  const [bellActive, bellToggle] = useState("");

  function toggleBell() {
    if (!bellActive) {
      bellToggle(true);
    } else {
      bellToggle(false);
    }
  }

  
  function togglePfp(){
    if (!pfpActive) {
        pfpToggle(true);
      } else {
        pfpToggle(false);
    }
  }

  
  useEffect(() => {
  if(props.props.clickTarget){
    
    if(!logoutRef.current.contains(props.props.clickTarget)){
      pfpToggle(false);
    }

    if(!bellRef.current.contains(props.props.clickTarget)){
      bellToggle(false);
    }

  }
}, [props.props.clickTarget]);



  return (
    <div>
      <nav
        className={
          "navbar navbar-expand-lg fixed-top " +
          (document.documentElement.scrollTop > 200 ? "noTransparrent" : "")
        }
        id="navbar"
      >
        <div className="container">
          <div className="logo">
            <Link to={`/${props.props.userInfo.login.userType}-dashboard`}>
            <a className="navbar-brand">
              <img src="../../images/Uskudar_Universitesi_logo.png" alt="logo" />
            </a>
            </Link>
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
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="pages m-auto">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className={"nav-link " + (props.NavLocation == 'dashboard'? "active" : "")}
                    to="/student-dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={"nav-link " + (props.NavLocation == 'jobs'? "active" : "")}
                    to="/job-offers"
                  >
                    Available Jobs
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" id="envelope">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <div className={"msgs  " + (bellActive ? "active" : "")}>
                  {" "}
                  {/* pass the msgsRef to the ref attribute */}
                  <a href="new-msg.html">
                    <span className="msg" id="sendMessage">
                      Send Message
                    </span>
                  </a>
                  <a href="incoming-message.html">
                    <span className="msg" id="seeMessage">
                      See Message
                    </span>
                  </a>
                </div>
              </li>
              <li className="nav-item bell" id="bell" ref={bellRef}>
                <a className="nav-link" onClick={toggleBell}>
                  <FontAwesomeIcon icon={faBell} />
                </a>
              </li>
            </ul>

            <div className="user-info" ref={logoutRef} onClick={togglePfp}>
              <span id="user-name">{props.props.userInfo.login ? props.props.userInfo.login.firstname + ' ' + props.props.userInfo.login.surname : ''}</span>
              <div className="pfp-info">
                <a id="pfp">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </a>
                <span
                  id="pfp-span"
                  className={"pfp-span " + (pfpActive ? "active" : "")}
                  onClick={() => Logout(props)}
                >
                  Logout
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;

// const bell = document.getElementById("bell");
// const bellContainer = document.querySelector(".container.not");
// const envelope = document.getElementById("envelope");
// const msgs = document.querySelector(".msgs");
// bell.addEventListener("click", () => {
//     bellContainer.classList.toggle("active");
// });
