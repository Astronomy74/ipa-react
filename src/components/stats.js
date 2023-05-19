import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./fireStorage";

//stats sCss
import '../sass/stas.scss'


function StudentStats(props){


  const [UploadedFile, UploadedFileHandle] = useState("");
  const [progress, setProgress] = useState(0);

  function GetFile(file) {
    UploadedFileHandle(file);
    console.log(file);
  }

  function HandleSubmit() {
    const sotrageRef = ref(storage, `images/${UploadedFile.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, UploadedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }


  return(
      <main>
          <NavBar props={props} NavLocation={'dashboard'}/>
          <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
          <div className="statsContainer text-center">
            <div className="card">
              <div className="card-header">
                Hint <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div className="card-body">
                <p>Press <code>Spacebar</code> to change between internships.</p>
              </div>
            </div>
              <div className="row g-0">
                  <div className="col-12">
                      <div className="app">
                          <h1>Application Process</h1>
                      </div>
                      <div className="intern-btns">
                          <div className="btns-top text">
                              <a className="intern-btn active" id="button1" data-json="../data/internship.json">Internship 1</a>
                              <a className="intern-btn"        id="button2" data-json="../data/InternshipTwo.json">Internship 2</a>
                              <a className="intern-btn"        id="button3" data-json="../data/InternshipThree.json">Internship 3</a>
                          </div>
                      </div>
                  </div>
                  <div className="col-12 boxs">
                      <div className="box" id="yearApp" style={{order: 4}}>
                          <h2>Year</h2>
                          <p></p>
                      </div>
                      <div className="box" id="companyApp" style={{order: 2}}>
                          <h2>Company</h2>
                          <p></p>
                      </div>
                      <div className="box" id="statusApp" style={{order: 5}}>
                          <h2>Status</h2>
                          <p></p>
                      </div>
                      <div className="box" id="durationApp" style={{order: 3}}>
                          <h2>Duration</h2>
                          <p></p>
                      </div>
                      <div className="box" id="JobTitleApp">
                          <h2>Job title</h2>
                          <p></p>
                      </div>
              </div>
          </div>
                  <div className="col-md-12">
                      <div className="btns">
                          <a className="statsBtn">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                          {/* <a className="statsBtn">Upload Form<i className="fa-solid fa-paper-plane"></i></a> */}
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Form"} filePass={GetFile} />
                          <a className="statsBtn">Request​ Official Letter<i className="fa-solid fa-upload"></i></a>
                          <a className="statsBtn">Upload Transcript<i className="fa-solid fa-download"></i></a>
                      </div>
                  </div>
              </div>
      </main>
  );
}

export default StudentStats;


{/* <section className="apply-form" style={{ display: "block" }}>
            <div className="row">
              <div className=".col-md-12">
                <div className="formContainer">
                  <form action="POST ">
                    <input type="text" required placeholder="First Name" />
                    <input type="text" required placeholder="Last Name" />
                    <input type="text" required placeholder="Age" />
                    <input type="text" required placeholder="Country" />
                    <input type="email" required placeholder="Email" />
                    <input type="text" required placeholder="Phone Number" />
                    <div className="ControlButtons">
                      <UploadButton filePass={GetFile} />
                      <input
                        onClick={HandleSubmit}
                        type="submit"
                        value="Send"
                        className="btn"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section> */}