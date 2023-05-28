import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, serverTimestamp, where, addDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'


function StudentStats(props){

  const lastItem = useLocation().pathname.split("/").pop();
  const [InternShip, getInternShip] = useState("");
  const [form, UploadedFormHandle] = useState("");
  const [transcript, UploadedTranscriptHandle] = useState("");
  const [progress, setProgress] = useState(0);
  const compRef = useRef(null);
  const [coordinatorInfo, setCoordinatorInfo] = useState('');
  const [Note, setNote] = useState('');


  
  
  

  function GetForm(file) {
    UploadedFormHandle(file);
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
    UploadedFormHandle("");
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

  

 


  const HandleFileSubmit = async (e) => {
    e.preventDefault();
    if(!form || !transcript){
      return;
    }
  
      const formRef = ref(storage, `internship/${props.userInfo.login.email}/${lastItem}/${form.name}`);
      const transcriptRef = ref(storage, `internship/${props.userInfo.login.email}/${lastItem}/${transcript.name}`);
      const uploadForm = uploadBytesResumable(formRef, eval(form));
      const uploadTranscript = uploadBytesResumable(transcriptRef, eval(transcript));
      uploadForm.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => console.log(error),
        () => {
          UploadedFormHandle("");
        }
      );
      uploadTranscript.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => console.log(error),
        () => {
          UploadedTranscriptHandle("");
        }
      );
    
  }

  function requestLetter(reqType){

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


  const downloadFile = (event) => {
    const storageRef = ref(storage, 'internship/template/form-template.pdf');
    event.preventDefault();
    getDownloadURL(storageRef)
      .then((downloadURL) => {
        // Fetch the file using a GET request with responseType: 'blob'
          
          let url = downloadURL;
        
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function(event){
            const blob = xhr.response;
            const blobUrl = window.URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = "form-template.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        
            window.URL.revokeObjectURL(blobUrl);
          };
          xhr.open("GET", url);
          xhr.send();
        
      })
      .catch((error) => {
        console.log('Error getting download URL:', error);
      });
  };
  

  if(props.internshipInfo.internshipList){
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
                            <a onClick={downloadFile} className="statsBtn">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                            <a onClick={() => requestLetter("letter")} className="statsBtn">Request​ Official Letter<i className="fa-solid fa-upload"></i></a>
                        </div> 
                        <h2>Submit Application</h2>
                        <form className="login-form needs-validation" noValidate onSubmit={HandleFileSubmit}>
                          <div className="mb-3">
                              <textarea
                                type="text"
                                name="note"
                                className="form-control"
                                id="note"
                                aria-describedby="Note"
                                placeholder="Optional Note"
                                required
                                value={Note}
                                onChange={(e) => setNote(e.target.value)}
                              />
                          </div>
                          <div className="mb-3">
                            <div className="form-control">
                              <UploadButton buttonText={"Browse"} filePass={GetForm} />
                              <input
                                type="text"
                                name="uploadForm"
                                id="uploadForm"
                                aria-describedby="uploadForm"
                                placeholder="Upload Form"
                                readOnly
                                value={form ? form.name : ""}
                              />
                              </div>
                          </div>
                          <div className="mb-3">
                            <div className="form-control">
                            <UploadButton buttonText={"Browse"} filePass={GetTranscript} />
                              <input
                                type="text"
                                name="uploadTranscript"
                                id="uploadTranscript"
                                aria-describedby="uploadTranscript"
                                placeholder="Upload Transcript"
                                readOnly
                                value={transcript ? transcript.name : ""}
                              />
                            </div>
                          </div>
                          <div className="btns">
                        
                            <button type="submit" className="send-btn">
                                Submit
                            </button>
                          </div>
                        </form>
                        
                    </div>
                </div>
        </main>
    );
  }
  
}

export default StudentStats;

