import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./fireStorage";
import { Link, useNavigate } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'


function StudentStats(props){

  const lastItem = useLocation().pathname.split("/").pop();
  const [InternShip, getInternShip] = useState("");
  const [UploadedForm, UploadedFromHandle] = useState("");
  const [UploadedTranscript, UploadedTranscriptHandle] = useState("");
  const [progress, setProgress] = useState(0);
  const compRef = useRef(null);
  

  function GetForm(file) {
    UploadedFromHandle(file);
  }

  function GetTranscript(file) {
    UploadedTranscriptHandle(file);
  }

  const navigate = useNavigate();

  useEffect(() => {
    props.internshipCollect(props.userInfo.login);
    let internshipTemp;
    for(let i = 0; i < props.internshipInfo.internshipList.length; i++){
      let internship = props.internshipInfo.internshipList[i];
      if(internship.title === lastItem.replace(/-/g, " ")){
        internshipTemp = internship;
      }
    }
    getInternShip(internshipTemp);
    UploadedFromHandle("");
    UploadedTranscriptHandle("");
    

    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        // Spacebar is pressed
        event.preventDefault();
        if(lastItem == 'Internship-1'){
          navigate('/student-dashboard/stats/Internship-2');
        } else {
          navigate('/student-dashboard/stats/Internship-1');
        }
      }
    };

    const element = compRef.current;
    element.setAttribute("tabindex", "0"); // Make the element focusable
    element.focus();
    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastItem]);

  

 


  // function HandleSubmit() {
  //   const sotrageRef = ref(storage, `images/${UploadedFile.name}`);
  //   const uploadTask = uploadBytesResumable(sotrageRef, UploadedFile);
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const prog = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setProgress(prog);
  //     },
  //     (error) => console.log(error),
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("File available at", downloadURL);
  //       });
  //     }
  //   );
  // }


  const internshipBtns = props.internshipInfo.internshipList.map((btn, index) => {
    return(
      <div className="btns-top text" key={index}>
          <Link to={`/student-dashboard/stats/${btn.title.replace(/\s/g, "-")}`}><span className={"intern-btn " + (InternShip.title == btn.title ? 'active' : '')} id="button1" data-json="../data/internship.json">{btn.title}</span></Link>
      </div>
    )
  });


  return(
      <main ref={compRef} tabIndex={0}>
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
                          {internshipBtns}
                      </div>
                  </div>
                  <div className="col-12 boxs">
                      <div className="box" id="yearApp" style={{order: 4}}>
                          <h2>{InternShip.year}</h2>
                          <p></p>
                      </div>
                      <div className="box" id="companyApp" style={{order: 2}}>
                          <h2>{InternShip.company}</h2>
                          <p></p>
                      </div>
                      <div className="box" id="statusApp" style={{order: 5}}>
                          <h2>{InternShip.status}</h2>
                          <p></p>
                      </div>
                      <div className="box" id="durationApp" style={{order: 3}}>
                          <h2>{InternShip.duration}</h2>
                          <p></p>
                      </div>
                      <div className="box" id="JobTitleApp">
                          <h2>{InternShip.jobtitle}</h2>
                          <p></p>
                      </div>
              </div>
          </div>
                  <div className="col-md-12">
                      <div className="btns">
                          <a className="statsBtn">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                          {/* <a className="statsBtn">Upload Form<i className="fa-solid fa-paper-plane"></i></a> */}
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Form"} filePass={GetForm} />
                          <a className="statsBtn">Request​ Official Letter<i className="fa-solid fa-upload"></i></a>
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Transcript"} filePass={GetTranscript} />
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