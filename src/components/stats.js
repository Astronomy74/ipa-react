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
  const [InternShip, getInternShip] = useState([]);
  const [form, UploadedFormHandle] = useState("");
  const [transcript, UploadedTranscriptHandle] = useState("");
  const [progress, setProgress] = useState(0);
  const compRef = useRef(null);
  const [Note, setNote] = useState('');
  const [docExist, setDocExist] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [downloadURL, setDownloadURL] = useState('');
  const [fileExists, setFileExists] = useState(false);
  const [InternShips, setInternShips] = useState([]);
  
  function GetForm(file) {
    UploadedFormHandle(file);
  }

  function GetTranscript(file) {
    UploadedTranscriptHandle(file);
  }

  const navigate = useNavigate();
  const db = getFirestore();
  const applicationsRef = collection(db, "applications");

 
  useEffect(() => {
    setFileExists(false);
    setDocExist(false);
    const qInternships = query(applicationsRef);
    
    getDocs(qInternships).then((querySnapshot) => {
    const documents = querySnapshot.docs;
    const hasLoginEmail = documents.some((doc) => doc.id === props.userInfo.login.email);
    if (hasLoginEmail) {
        const docRef = doc(applicationsRef, props.userInfo.login.email);
        getDoc(docRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const documentData = docSnapshot.data();
            const internshipsObject = documentData;
            const internship1 = internshipsObject["Internship1"];
            const internship2 = internshipsObject["Internship2"];
            const internshipsArray = [internship1, internship2];
            setInternShips(internshipsArray)
            
           
              for(let i = 0; i < internshipsArray.length; i++){
                let internship = internshipsArray[i];
                
                if(internship.title === lastItem.replace(/-/g, " ")){
                  let id = "Internship" + (i + 1);
                  getInternShip(internship);
                  UploadedFormHandle("");
                  UploadedTranscriptHandle("");


                  if (internship.status === "processing" || internship.status === "pending") {
                    setDocExist(true);
                    setDisplayText("You already have an application in process");
                    setFileExists(false); 
                  }
                  if (internship && (internship.status === "accepted")){
                    setDocExist(true);
                    setDisplayText("Your application is already accepted");
                    const filePath = `internship/${props.userInfo.login.email}/${id}/${props.userInfo.login.email}-sgk.pdf`;
                  
                    const checkFileExistence = async () => {
                      const fileRef = ref(storage, filePath);
                      try {
                        const url = await getDownloadURL(fileRef);
                        setDownloadURL(url)
                        setFileExists(true);
                      } catch (error) {
                        console.error('Error checking file existence:', error);
                        
                      }
                    };
                    checkFileExistence();
                  }

                  if(!internship.status) {
                    setDocExist(false);
                    setDisplayText("")
                    setFileExists(false);
                  }
                  
                }
              }
            
          }
        });
      }
    });
    
    
    
    
    
    

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

  

  
  
  const HandleFileSubmit = async (e) => {
    e.preventDefault();
    if(!form || !transcript){
      return;
    }
    const currentInternship = lastItem.replace(/-/g, "");
    async function insertDatabase(formurl, transcripturl){
      
      const applicationData = {
        concluded: false,
        form: formurl,
        insured: false,
        status: "pending",
        transcript: transcripturl,
        note: Note,
      };
      const docId = props.userInfo.login.email;
      const docRef = doc(applicationsRef, docId);
      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          // Document already exists, update the existing map object
          const existingData = docSnapshot.data();
            

            // Find the internship object that matches currentInternship and update it with applicationData
            
              existingData[currentInternship] = {
                ...existingData[currentInternship],
                ...applicationData,
              };
           

            // Update the lastactivity field
            existingData.lastactivity = serverTimestamp();

            await setDoc(docRef, existingData);
            setDocExist(true);
            setDisplayText("Your Application Has Been Submitted");
          }

          console.log("Document inserted/updated successfully.");
        } catch (error) {
          console.error("Error inserting/updating document:", error);
        }
    }
      const formextention = form.name.split('.').pop().toLowerCase();
      const transcriptextention = transcript.name.split('.').pop().toLowerCase();
      const formRef = ref(storage, `internship/${props.userInfo.login.email}/${currentInternship}/${props.userInfo.login.email}-${"form"}.${formextention}`);
      const transcriptRef = ref(storage, `internship/${props.userInfo.login.email}/${currentInternship}/${props.userInfo.login.email}-${"transcript"}.${transcriptextention}`);
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

  

  const handleDownloadButtonClick = (event) => {
    event.preventDefault();
    let url = downloadURL;

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function(event){
    const blob = xhr.response;
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = "sgk-insurance.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(blobUrl);
    };
    xhr.open("GET", url);
    xhr.send();
  };


  if(InternShips){
   
  
    const internshipBtns = InternShips.map((btn, index) => {
      return(
        <div className="btns-top text" key={index}>
            <Link to={`/student-dashboard/stats/${btn.title.replace(/\s/g, "-")}`}><span className={"intern-btn " + (btn.title === InternShip.title ? 'active' : '')} id="button1" data-json="../data/internship.json">{btn.title}</span></Link>
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
                            <button type="submit" className={`send-btn ${docExist ? 'disabled' : ''}`} disabled={docExist}>
                                Submit
                            </button>
                            
                          </div>
                        </form>
                        <div>
                          {fileExists && 
                            <button onClick={handleDownloadButtonClick}>Download SGK Insurance</button>
                          }
                        </div>
                    </div>
                </div>
        </main>
    );
    }
  }
  


export default StudentStats;

