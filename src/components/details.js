import React, { useState, useEffect } from "react";
import NavBar from "./navBar";


// applyNow sCss
import "../sass/applyNow.scss";

function Details(props) {
  const localStorageJob = localStorage.getItem("JobDetails");
  const jobDetails = JSON.parse(localStorageJob);
  console.log(jobDetails)
  

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
                        src={jobDetails.logo}
                        width="auto"
                        height="100"
                        alt=""
                      />
                    </div>
                    <div className="text">
                      <p>
                        Job Title: <span id="jobTitle">{jobDetails.title}</span>
                      </p>
                      <p>
                        Required Language(s): <span id="requiredLanguages">{jobDetails.languages}</span>
                      </p>
                      <p>
                        Duration: <span id="jobDuration">{jobDetails.duration}</span>
                      </p>
                      <p>
                        Required Skill(s): <span id="requiredSkills">{jobDetails.skills}</span>
                      </p>
                      <p>
                        Paid: <span id="paidJob">{jobDetails.paid}</span>
                      </p>
                      <p>
                        Location: <span id="address">{jobDetails.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                    <div className="map">
                        <iframe id="location"
                            src={jobDetails.maps}
                            style={{border: 0}}
                            width="600"
                            height="450"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

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