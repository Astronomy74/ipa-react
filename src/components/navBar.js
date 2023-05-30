import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { storage } from "./fireStorage";
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, getDoc, query, setDoc, serverTimestamp, where, addDoc, doc } from "firebase/firestore";


// NavBar style
import "../css/navBar.css";

function NavBar(props) {

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {

  async function fetchUnreadMessages() {
    try {
      const db = getFirestore();
      const conversationsRef = collection(db, 'conversations');
      
      // query to find document where participant is logged in user
      const q = query(conversationsRef, where('participants', 'array-contains', props.props.userInfo.login.email));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const conversationData = doc.data();
        
        // iterate through the map objects
        for (const messageId in conversationData) {
          const message = conversationData[messageId];
          
          if (message.isRead === false && message.receiver === props.props.userInfo.login.email) {
            // logic for if an unread message is found goes here
            setHasUnreadMessages(true);
          }
        }
      });
      
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }
  }
  fetchUnreadMessages()
})
  
  const msgsRef = useRef(null); // define a useRef hook for the msgs element
  const logoutRef = useRef(null);
  const bellRef = useRef(null);

  let jobs, toJobs, jobText;
  if(props.props.userInfo.login.userType === "student"){
    jobs = 'jobs';
    toJobs = '/job-offers';
    jobText = "Available Jobs";
  }
  else if(props.props.userInfo.login.userType === "career"){
    jobs = 'jobs';
    toJobs = '/announceJobs';
    jobText = "Handle Job Offers"
  }
  


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
            <div className="navbar-brand">
              <img src="../../images/Uskudar_Universitesi_logo.png" alt="logo" />
            </div>
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
                    to="/career-dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={"nav-link " + (props.NavLocation == 'jobs'? "active" : "")}
                    to={toJobs}
                  >
                    {jobText}
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <Link to={`/messages`}>
              <li className="nav-item">
                <span className="nav-link" id="envelope">
                  <FontAwesomeIcon icon={faEnvelope} />
                  {hasUnreadMessages && <img src="../../images/notification.png" alt="notification" className="unread-badge" />}
                </span>
                <div className={"msgs  " + (bellActive ? "active" : "")}>
                  {" "}
                  {/* pass the msgsRef to the ref attribute */}
                  
                  <div>
                    <span className="msg" id="sendMessage">
                      Send Message
                    </span>
                  </div>
                </div>
              </li>
              </Link>
              <li className="nav-item bell" id="bell" ref={bellRef}>
                <span className="nav-link" onClick={toggleBell}>
                  <FontAwesomeIcon icon={faBell} />
                </span>
              </li>
            </ul>

            <div className="user-info" ref={logoutRef} onClick={togglePfp}>
              <span id="user-name">{props.props.userInfo.login ? props.props.userInfo.login.firstname + ' ' + props.props.userInfo.login.surname : ''}</span>
              <div className="pfp-info">
                <span id="pfp">
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </span>
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
