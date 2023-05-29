import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
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
  const [disabled, setDisabled] = useState(false);
  const [docExist, setDocExist] = useState(false);
  const [displayText, setDisplayText] = useState("");
  
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
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
          // If the focused element is an input or textarea, do nothing
          return;
        }
        UploadedFormHandle("");
        UploadedTranscriptHandle("");
        setNote("");
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

  

  const db = getFirestore();
  const applicationsRef = collection(db, "applications");


  const HandleFileSubmit = async (e) => {
    e.preventDefault();
    if(!form || !transcript){
      return;
    }
    async function insertDatabase(formurl, transcripturl){
      const applicationData = {
        studentEmail: props.userInfo.login.email,
        concluded: false,
        form: formurl,
        insured: false,
        status: "pending",
        transcript: transcripturl,
        note: Note,
        firstname: props.userInfo.login.firstname,
        surname: props.userInfo.login.surname
      };
      const docId = props.userInfo.login.email;
      const docRef = doc(applicationsRef, docId);
      try {
        const docSnapshot = await getDoc(docRef);
    
        if (docSnapshot.exists()) {
          // Document already exists, update the existing map object
          const existingData = docSnapshot.data();
          const newData = {
            ...existingData,
            [lastItem]: applicationData,
            lastactivity: serverTimestamp()
          };
    
          await setDoc(docRef, newData);
        } else {
          // Document doesn't exist, create a new one with the map object
          const dataToUpdate = {
            [lastItem]: applicationData,
            lastactivity: serverTimestamp()
          };
    
          await setDoc(docRef, dataToUpdate);
        }
        
        console.log("Document inserted/updated successfully.");
      } catch (error) {
        console.error("Error inserting/updating document:", error);
      }
    }
      const formextention = form.name.split('.').pop().toLowerCase();
      const transcriptextention = transcript.name.split('.').pop().toLowerCase();
      const formRef = ref(storage, `internship/${props.userInfo.login.email}/${lastItem}/${props.userInfo.login.email}-${"form"}.${formextention}`);
      const transcriptRef = ref(storage, `internship/${props.userInfo.login.email}/${lastItem}/${props.userInfo.login.email}-${"transcript"}.${transcriptextention}`);
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
              getDownloadURL(formRef).then((formurl) => {
                getDownloadURL(transcriptRef).then((transcripturl) => {
                  insertDatabase(formurl, transcripturl);
                  UploadedFormHandle("");
                  UploadedTranscriptHandle("");
                  setNote("");
                });
              });
              
            }
            );
       
      }
      );
  }



  useEffect(() => {
    const isDocExist = async () => {
      const documentRef = doc(applicationsRef, props.userInfo.login.email);
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        const mapObject = documentData[lastItem];
      
        if (mapObject && (mapObject.status === "processing" || mapObject.status === "pending")) {
          setDocExist(true);
          setDisplayText("You already have an application in process");
        }
        else if (mapObject && (mapObject.status === "accepted")){
          setDocExist(true);
          setDisplayText("Your application is already accepted")
        }else {
          setDocExist(false);
          setDisplayText("")
        }
      }
    };
    isDocExist();
  }, [lastItem]);
  

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
            <NavBar props={props}/>
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
                            <h2>Year</h2>
                            <p>{InternShip.year}</p>
                        </div>
                        <div className="box" id="companyApp" style={{order: 2}}>
                            <h2>Company</h2>
                            <p>{InternShip.company}</p>
                        </div>
                        <div className="box" id="statusApp" style={{order: 5}}>
                            <h2>Status</h2>
                            <p>{InternShip.status}</p>
                        </div>
                        <div className="box" id="durationApp" style={{order: 3}}>
                            <h2>Duration</h2>
                            <p>{InternShip.duration}</p>
                        </div>
                        <div className="box" id="JobTitleApp">
                            <h2>Job Title</h2>
                            <p>{InternShip.jobtitle}</p>
                        </div>
                </div>
            </div>
                    <div className="col-md-12">
                        
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
                          {docExist && <p className="disabled-text">{displayText}</p>}
                            <button type="submit" className={`send-btn ${docExist ? 'disabled' : ''}`} disabled={docExist || disabled}>
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

