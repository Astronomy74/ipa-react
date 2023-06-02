import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { storage } from "./fireStorage";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
  setDoc,
  serverTimestamp,
  where,
  addDoc,
  doc,
} from "firebase/firestore";

// PFP IMSGES
import student from "../pfpImgs/stu.jpg";
import KRİSTİN from "../pfpImgs/KRİSTİN.png";

// NavBar style
import "../css/navBar.css";

function NavBar(props) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasNotifications, sethasNotifications] = useState(false);
  const [NotificationsData, setNotificationsData] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const notificationsRef = collection(db, "notifications");
    const qNotifications = query(notificationsRef);
    getDocs(qNotifications).then((querySnapshot) => {
      const documents = querySnapshot.docs;
      const hasLoginEmail = documents.some(
        (doc) => doc.id === props.props.userInfo.login.email
      );
      if (props.props.userInfo.login.userType === "student") {
        if (hasLoginEmail) {
          const docRef = doc(
            notificationsRef,
            props.props.userInfo.login.email
          );
          getDoc(docRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const documentData = docSnapshot.data();
              const notificationsData = [];

              // Get the keys of the documentData object
              const keys = Object.keys(documentData);
              const currentTime = new Date();

              // Sort the keys based on the timestamp in each key
              keys.sort();
              const lastThreeKeys = keys.slice(-3);

              // Loop over the documents
              for (const key of lastThreeKeys) {
                const notification = documentData[key];
                if (!notification.isRead) {
                  sethasNotifications(true);
                }
                notificationsData.push({
                  ...notification,
                  timeDifference: getTimeDifference(key, currentTime),
                });
              }
              const reversedArray = notificationsData.reverse();
              setNotificationsData(reversedArray);
            }
          });

          // Function to calculate the time difference
          function getTimeDifference(timestamp, currentTime) {
            const notificationTime = new Date(timestamp);
            const timeDifference = currentTime - notificationTime;
            // Calculate the time difference in minutes
            const minutes = Math.floor(timeDifference / 60000);
            // Calculate the time difference in 10-minute intervals
            const interval = Math.floor(minutes / 10);

            if (minutes < 1) {
              return `Just Now`;
            }
            if (minutes < 10) {
              return `${minutes} minutes ago`;
            } else if (minutes < 60) {
              return `${interval * 10} minutes ago`;
            } else {
              const hours = Math.floor(minutes / 60);
              return `${hours} hours ago`;
            }
          }
        } else {
          const docRef = doc(
            notificationsRef,
            props.props.userInfo.login.email
          );
          setDoc(docRef, {});
        }
      }
    });
  }, []);

  useEffect(() => {
    async function fetchUnreadMessages() {
      try {
        const db = getFirestore();
        const conversationsRef = collection(db, "conversations");

        // query to find document where participant is logged in user
        const q = query(
          conversationsRef,
          where(
            "participants",
            "array-contains",
            props.props.userInfo.login.email
          )
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const conversationData = doc.data();

          // iterate through the map objects
          for (const messageId in conversationData) {
            const message = conversationData[messageId];
            try {
              if (
                message.isRead === false &&
                message.receiver === props.props.userInfo.login.email
              ) {
                // logic for if an unread message is found goes here
                setHasUnreadMessages(true);
              }
            } catch (error) {
              console.log("Message is null");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        throw error;
      }
    }
    fetchUnreadMessages();
  });

  const msgsRef = useRef(null); // define a useRef hook for the msgs element
  const logoutRef = useRef(null);
  const bellRef = useRef(null);

  let jobs, toJobs, jobText;
  if (props.props.userInfo.login.userType === "student") {
    jobs = "jobs";
    toJobs = "/job-offers";
    jobText = "Available Jobs";
  } else if (props.props.userInfo.login.userType === "career") {
    jobs = "jobs";
    toJobs = "/announceJobs";
    jobText = "Handle Job Offers";
  }

  const [pfpActive, pfpToggle] = useState("");
  const [bellActive, bellToggle] = useState("");

  function toggleBell() {
    if (hasNotifications) {
      const db = getFirestore();
      const notificationsRef = collection(db, "notifications");

      const docRef = doc(notificationsRef, props.props.userInfo.login.email);
      getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const documentData = docSnapshot.data();

          for (const key in documentData) {
            if (documentData.hasOwnProperty(key)) {
              const notification = documentData[key];
              // Set isRead to true
              notification.isRead = true;
            }
          }

          // Update the document with modified data
          setDoc(docRef, documentData)
            .then(() => {
              console.log("Notifications updated successfully");
            })
            .catch((error) => {
              console.error("Error updating notifications:", error);
            });
        }
      });

      sethasNotifications(false);
    }

    if (!bellActive) {
      bellToggle(true);
    } else {
      toggleOff();
    }
  }

  function toggleOff() {
    bellToggle(false);
    let TempNotifications = NotificationsData;
    let readChange = [];
    for (let i = 0; i < TempNotifications.length; i++) {
      let tempIndex = TempNotifications[i];
      tempIndex.isRead = true;
      readChange.push(tempIndex);
    }
    setNotificationsData(readChange);
  }

  function togglePfp() {
    if (!pfpActive) {
      pfpToggle(true);
    } else {
      pfpToggle(false);
    }
  }

  useEffect(() => {
    if (props.props.clickTarget) {
      if (!logoutRef.current.contains(props.props.clickTarget)) {
        pfpToggle(false);
      }

      if (props.props.userInfo.login.userType === "student") {
        if (!bellRef.current.contains(props.props.clickTarget)) {
          bellToggle(false);
          let TempNotifications = NotificationsData;
          let readChange = [];
          for (let i = 0; i < TempNotifications.length; i++) {
            let tempIndex = TempNotifications[i];
            tempIndex.isRead = true;
            readChange.push(tempIndex);
          }
          setNotificationsData(readChange);
        }
      }
    }
  }, [props.props.clickTarget]);

  const renderNotifications = NotificationsData.map((item, index) => {
    const fontWeight = item.isRead ? "normal" : "bolder";
    return (
      <span className="msg" id="sendMessage" key={index} style={{ fontWeight }}>
        {item.notification}
        <span className="msg-time">
        <FontAwesomeIcon icon={faClock} />
          {item.timeDifference}</span>
      </span>
    );
  });

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
                <img
                  src="../../images/Uskudar_Universitesi_logo.png"
                  alt="logo"
                />
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
                    className={
                      "nav-link " +
                      (props.NavLocation == "dashboard" ? "active" : "")
                    }
                    to="/career-dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      "nav-link " +
                      (props.NavLocation == "jobs" ? "active" : "")
                    }
                    to={toJobs}
                  >
                    {jobText}
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {(props.props.userInfo.login.userType === "student" ||
                props.props.userInfo.login.userType === "coordinator") && (
                <Link to={`/messages`}>
                  <li className="nav-item">
                    <span className="nav-link" id="envelope">
                      <FontAwesomeIcon icon={faEnvelope} />
                      {hasUnreadMessages && (
                        <img
                          src="../../images/notification.png"
                          alt="notification"
                          className="unread-badge"
                        />
                      )}
                    </span>
                  </li>
                </Link>
              )}

              {props.props.userInfo.login.userType === "student" && (
                <li className="nav-item bell" id="bell" ref={bellRef}>
                  <span className="nav-link" onClick={toggleBell}>
                    <FontAwesomeIcon icon={faBell} />
                    {hasNotifications && (
                      <img
                        src="../../images/notification.png"
                        alt="notification"
                        className="unread-badge"
                      />
                    )}
                    <div className={"msgs  " + (bellActive ? "active" : "")}>
                      {renderNotifications}
                    </div>
                  </span>
                </li>
              )}
            </ul>

            <div className="user-info" ref={logoutRef} onClick={togglePfp}>
              <span id="user-name">
                {props.props.userInfo.login
                  ? props.props.userInfo.login.firstname +
                    " " +
                    props.props.userInfo.login.surname
                  : ""}
              </span>
              <div className="pfp-info">
                <span id="pfp" className="pfp-image">
                  {props.props.userInfo.login.userType === "student" ? (
                    <img src={student} alt="Student Profile" />
                  ) : (
                    <img src={KRİSTİN} alt="KRİSTİN Profile" />
                  )}
                </span>
                <span
                  id="pfp-span"
                  className={"pfp-span " + (pfpActive ? "active" : "")}
                  onClick={() => Logout(props)}
                >
                  <button class="logoutBtn">
                    <div class="sign">
                      <svg viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                      </svg>
                    </div>

                    <div class="text">Logout</div>
                  </button>
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
