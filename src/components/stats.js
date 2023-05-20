import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { Link, useNavigate } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'


function StudentStats(props){

  const lastItem = useLocation().pathname.split("/").pop();
  const [InternShip, getInternShip] = useState("");
  const [form, UploadedFromHandle] = useState("");
  const [transcript, UploadedTranscriptHandle] = useState("");
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

  

 


  function HandleFileSubmit(filename) {
    if(transcript || form){
      const storageRef = ref(storage, `internship/${filename}/${props.userInfo.login.email}-${lastItem}-${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, eval(filename));
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
          UploadedFromHandle("");
          UploadedTranscriptHandle("");
        }
      );
    }
  }


  function HandleFileDelete(filename) {
    
      const storageRef = ref(
        storage,
        `internship/${filename}/${props.userInfo.login.email}-${lastItem}-${filename}`
      );
  
      deleteObject(storageRef)
        .then(() => {
          console.log('File deleted successfully');
        })
        .catch((error) => {
          console.log('Error deleting file:', error);
        });
    
  }


  const handleDownload = () => {
    const storageRef = ref(storage, 'internship/template/form-template.pdf');
  
    getDownloadURL(storageRef)
      .then((downloadURL) => {
        // Fetch the file using a GET request with responseType: 'blob'
        fetch(downloadURL, { method: 'GET', mode: 'no-cors', responseType: 'blob' })
          .then((response) => {
            // Create a blob URL from the response
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
  
            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = 'form-template.pdf';
  
            // Simulate a click on the link to trigger the download
            link.click();
  
            // Clean up the blob URL
            URL.revokeObjectURL(url);
          })
          .catch((error) => {
            console.log('Error fetching file:', error);
          });
      })
      .catch((error) => {
        console.log('Error getting download URL:', error);
      });
  };
  


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
                          <a onClick={handleDownload} className="statsBtn">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                          {/* <a className="statsBtn">Upload Form<i className="fa-solid fa-paper-plane"></i></a> */}
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Form"} filePass={GetForm} />
                          <button onClick={() => {
                            HandleFileSubmit("form");
                          }}>
                            send
                          </button>
                          <button onClick={() => {
                            HandleFileDelete("form");
                          }}>
                            Delete
                          </button>
                          <a className="statsBtn">Request​ Official Letter<i className="fa-solid fa-upload"></i></a>
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Transcript"} filePass={GetTranscript} />
                          <button onClick={() => {
                            HandleFileSubmit("transcript");
                          }}>
                            send
                          </button>
                          <button onClick={() => {
                            HandleFileDelete("transcript");
                          }}>
                            Delete
                          </button>
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