import React, { useEffect, useRef, useState } from "react";
import Logout from "./logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// NavBar style
import "../css/navBar.css";

function NavBar(props) {
  const msgsRef = useRef(null); // define a useRef hook for the msgs element

  function handleClick() {
    msgsRef.current.classList.toggle("active"); // use the msgsRef to toggle the active class
  }

  const [pfpActive, pfpToggle] = useState("");

  function togglePfp() {
    if (!pfpActive) {
      pfpToggle(true);
    } else {
      pfpToggle(false);
    }
  }

  const [bellActive, bellToggle] = useState("");

  function toggleBell() {
    if (!pfpActive) {
      bellToggle(true);
    } else {
      bellToggle(false);
    }
  }

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
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="pages m-auto">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="#dashBoard"
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#applyForJob">
                    OpenJobs
                  </a>
                </li>
              </ul>
            </div>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" id="envelope">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <div className="msgs" ref={msgsRef}>
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
              <li className="nav-item bell" id="bell">
                <a className="nav-link" onClick={handleClick}>
                  <FontAwesomeIcon icon={faBell} />
                </a>
              </li>
            </ul>

            <div className="user-info">
              <span id="user-name"></span>
              <div className="pfp-info">
                <a id="pfp" onClick={togglePfp}>
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
