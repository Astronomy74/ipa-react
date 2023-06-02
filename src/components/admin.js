import React, { useState } from "react";
import NavBar from "./navBar";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import "../sass/admin.scss";

function Admin(props) {
  const db = getFirestore();
  const auth = getAuth();
  const [coordinatorEmail, setCoordinatorEmail] = useState("");
  const [coordinatorPassword, setCoordinatorPassword] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorSurname, setCoordinatorSurname] = useState("");
  const [coordinatorDepartment, setCoordinatorDepartment] = useState("");
  const [careerCenterEmail, setCareerCenterEmail] = useState("");
  const [careerCenterPassword, setCareerCenterPassword] = useState("");
  const [careerCenterName, setCareerCenterName] = useState("");
  const [careerCenterSurname, setCareerCenterSurname] = useState("");
  const [adminOverlayActive, setAdminOverlayActive] = useState(false);

  const handleRegisterCoordinator = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        coordinatorEmail,
        coordinatorPassword
      );
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        email: coordinatorEmail,
        name: coordinatorName,
        surname: coordinatorSurname,
        department: coordinatorDepartment,
        userType: "coordinator",
      });
      setCoordinatorEmail("");
      setCoordinatorPassword("");
      setCoordinatorName("");
      setCoordinatorSurname("");
      setCoordinatorDepartment("");
      console.log("Coordinator registered successfully");
    } catch (error) {
      console.error("Error registering coordinator:", error);
      alert("An error occurred while registering the coordinator.");
    }
  };

  const handleRegisterCareerCenter = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        careerCenterEmail,
        careerCenterPassword
      );
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        email: careerCenterEmail,
        name: careerCenterName,
        surname: careerCenterSurname,
        userType: "career",
      });
      setCareerCenterEmail("");
      setCareerCenterPassword("");
      setCareerCenterName("");
      setCareerCenterSurname("");
      console.log("Career Center registered successfully");
    } catch (error) {
      console.error("Error registering Career Center:", error);
      alert("An error occurred while registering the Career Center.");
    }
  };

  const toggleAdminOverlay = (overlayType) => {
    setAdminOverlayActive(overlayType);
  };

  return (
    <main>
      <NavBar props={props} />
      <h1>Admin Dashboard</h1>
      {/* <h1>
              Welcome{" "}
              {props.userInfo.login
                ? props.userInfo.login.firstname +
                  " " +
                  props.userInfo.login.surname
                : ""}
            </h1> */}
      <div className="container container-admin">
        <div className="row">
          <h1>Registration Forms</h1>
          <div className="col-lg-6 sm-12 add-user Coordinator">
            <div className="row">
            <div className="col-md-7 left-side">
              <h1>Add User</h1>
            <div className="inputs-container">
              {/* Name */}
              <div>
                {/* <label>Name:</label> */}
                <input
                placeholder="Name"
                  type="text"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                />
              </div>
              {/* Surname */}
              <div>
                {/* <label>Surname:</label> */}
                <input
                placeholder="Surname"
                  type="text"
                  value={coordinatorSurname}
                  onChange={(e) => setCoordinatorSurname(e.target.value)}
                />
              </div>
              {/* Department */}
              <div>
                {/* <label>Department:</label> */}
                <input
                placeholder="Department"
                  type="text"
                  value={coordinatorDepartment}
                  onChange={(e) => setCoordinatorDepartment(e.target.value)}
                />
              </div>
              {/* Email */}
              <div>
                {/* <label>Email:</label> */}
                <input
                placeholder="Email"
                  type="email"
                  value={coordinatorEmail}
                  onChange={(e) => setCoordinatorEmail(e.target.value)}
                />
              </div>
              {/* Password */}
              <div>
                {/* <label>Password:</label> */}
                <input
                placeholder="Password"
                  type="password"
                  value={coordinatorPassword}
                  onChange={(e) => setCoordinatorPassword(e.target.value)}
                />
              </div>
              {/* button */}
              <button onClick={handleRegisterCoordinator}>
                Register
              </button>
              </div>
            </div>
            <div className="col-md-5 right-side">
            <div id="coordinatorOverlay" className={`admin-overlay ${adminOverlayActive === 'coordinator' ? 'coordinator-active' : ''}`} onClick={() => toggleAdminOverlay('coordinator')}>
              <div className="admin-text"> <h1> Coordinator Registration Form</h1></div>
            </div>
            </div>
            </div>
          </div>

          <div className="col-lg-6 sm-12 add-user Career">
            <div className="row">
            <div className="col-md-7 left-side">
              <h1>Add User</h1>
            <div className="inputs-container">
              {/* Name */}
              <div>
                {/* <label>Name:</label> */}
                <input
                placeholder="Name"
                  type="text"
                  value={careerCenterName}
                  onChange={(e) => setCareerCenterName(e.target.value)}
                />
              </div>
              {/* Surname */}
              <div>
                {/* <label>Surname:</label> */}
                <input
                placeholder="Surname"
                  type="text"
                  value={careerCenterSurname}
                  onChange={(e) => setCareerCenterSurname(e.target.value)}
                />
              </div>
              {/* Email */}
              <div>
                {/* <label>Email:</label> */}
                <input
                placeholder="Email"
                  type="email"
                  value={careerCenterEmail}
                  onChange={(e) => setCareerCenterEmail(e.target.value)}
                />
              </div>
              {/* Password */}
              <div>
              <input
                placeholder="Password"
                  type="password"
                  value={careerCenterPassword}
                  onChange={(e) => setCareerCenterPassword(e.target.value)}
                />
              </div>
              {/* button */}
              <button onClick={handleRegisterCareerCenter}>
                Register
              </button>
              </div>
            </div>
            <div className="col-md-5 right-side">
            <div id="CareerOverlay" className={`admin-overlay ${adminOverlayActive === 'career' ? 'career-active' : ''}`} onClick={() => toggleAdminOverlay('career')} >              <div className="admin-text"> <h1> Career Center Registration Form</h1></div>
            </div>
            </div>
            </div>
          </div>
        </div>


          {/* old code */}
        <section id="dashBoard" style={{ display: "none" }}>
          <div className="dashboard">

            <div className="container">
              <h2>Coordinator Registration</h2>
              {/* <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={coordinatorEmail}
                  onChange={(e) => setCoordinatorEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={coordinatorPassword}
                  onChange={(e) => setCoordinatorPassword(e.target.value)}
                />
              </div> */}

              {/* <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                />
              </div> */}

              {/* <div>
                <label>Surname:</label>
                <input
                  type="text"
                  value={coordinatorSurname}
                  onChange={(e) => setCoordinatorSurname(e.target.value)}
                />
              </div> */}
              {/* <div>
                <label>Department:</label>
                <input
                  type="text"
                  value={coordinatorDepartment}
                  onChange={(e) => setCoordinatorDepartment(e.target.value)}
                />
              </div> */}
              {/* <button onClick={handleRegisterCoordinator}>
                Register Coordinator
              </button> */}
            </div>
          </div>
        </section>
        <section id="dashBoard" style={{ display: "none" }}>
          <div className="dashboard">
            <div className="container">
              <h2>Career Center Registration</h2>
              <div>
                <label>Email:</label>
                <input
                placeholder="Email"
                  type="email"
                  value={careerCenterEmail}
                  onChange={(e) => setCareerCenterEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                placeholder="Password"
                  type="password"
                  value={careerCenterPassword}
                  onChange={(e) => setCareerCenterPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Name:</label>
                <input
                placeholder="Name"
                  type="text"
                  value={careerCenterName}
                  onChange={(e) => setCareerCenterName(e.target.value)}
                />
              </div>
              <div>
                <label>Surname:</label>
                <input
                placeholder="Surname"
                  type="text"
                  value={careerCenterSurname}
                  onChange={(e) => setCareerCenterSurname(e.target.value)}
                />
              </div>
              <button onClick={handleRegisterCareerCenter}>
                Register Career Center
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Admin;
