import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./fireStorage";

// applyNow sCss
import "../sass/applyNow.scss";

function Details(props) {
  const jobId = localStorage.getItem("JobId");
  

  return (
    <div>
      <NavBar props={props} NavLocation={'jobs'}/>
      <main>
        <div className="applyNowContainer">
          <section className="jop-details">
            <div className="container">
              <div className="row">
                <div className="col-md-5">
                  <div className="com-info">
                    <div className="image">
                      <img
                        id="jobImg"
                        src="../images/Teknosa_Logo.png"
                        alt=""
                      />
                    </div>
                    <div className="text">
                      <p id="forWho">For Senior Students</p>
                      <p>
                        Required Language(s):
                        <span id="requiredLanguages"></span>
                      </p>
                      <p>
                        Duration: <span id="jobDuration"></span>
                      </p>
                      <p>
                        Required Skill(s):
                        <span id="requiredSkills"></span>
                      </p>
                      <p>
                        Paid: <span id="paidJob"></span>
                      </p>
                      <p>
                        Location: <span id="address"></span>
                      </p>
                    </div>
                  </div>
                </div>
               
              </div>
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
}

export default Details;
