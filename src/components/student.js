import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { Link } from 'react-router-dom';
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, updateDoc, doc, addDoc, where } from "firebase/firestore";

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function Student(props){

    
    const [transcript, UploadedTranscriptHandle] = useState("");
    const [LetterUrl, SetLetterUrl] = useState("");
    const [Internships, setInternships] = useState([]);
   

   

    const db = getFirestore();
    
    useEffect(() => {
    async function getUrl(){
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(query(usersCollection, where("email", "==", props.userInfo.login.email)));

    querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        SetLetterUrl(userData.letter);
    });
    }
    getUrl();

    const internshipsRef = collection(db, 'applications');
    const qInternships = query(internshipsRef);
    getDocs(qInternships).then((querySnapshot) => {
    const documents = querySnapshot.docs;
    const hasLoginEmail = documents.some((doc) => doc.id === props.userInfo.login.email);
    if (hasLoginEmail) {
        const docRef = doc(internshipsRef, props.userInfo.login.email);
        getDoc(docRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const documentData = docSnapshot.data();
            const internshipsObject = documentData;
            const internship1 = internshipsObject["Internship1"];
            const internship2 = internshipsObject["Internship2"];
            const internshipsArray = [internship1, internship2];
            setInternships(internshipsArray);
          }
        });
      } else {
        const newDocRef = doc(internshipsRef, props.userInfo.login.email);
        const doc1Id = "Internship1";
        const doc2Id = "Internship2";
        const doc1Data = {
        company: "",
        duration: "",
        jobtitle: "",
        letter: "",
        status: "",
        title: "Internship 1",
        year: ""
        };
        const doc2Data = {
        company: "",
        duration: "",
        jobtitle: "",
        letter: "",
        status: "",
        title: "Internship 2",
        year: ""
        };
        const updates = {};
        updates[doc1Id] = doc1Data;
        updates[doc2Id] = doc2Data;
        setDoc(newDocRef, updates);
        const tempDoc = [doc1Data, doc2Data]
        setInternships(tempDoc);
    }
    });
    }, []);

    const requestsRef = collection(db, 'request')

    const HandleFileSubmit = async (e) => {
        e.preventDefault();
        if(!transcript){
            return;
        }
        async function insertDatabase(transcripturl){
            const LetterData = {
                studentEmail: props.userInfo.login.email,
                handled: false,
                transcript: transcripturl,
                firstname: props.userInfo.login.firstname,
                surname: props.userInfo.login.surname
            };
            
            try {
            
            await addDoc(requestsRef, LetterData);
            
            console.log("Document inserted/updated successfully.");
            } catch (error) {
            console.error("Error inserting/updating document:", error);
            }
        }
            const transcriptextention = transcript.name.split('.').pop().toLowerCase();
            const transcriptRef = ref(storage, `requests/${props.userInfo.login.email}/${props.userInfo.login.email}-${"transcript"}.${transcriptextention}`);
            const uploadTranscript = uploadBytesResumable(transcriptRef, eval(transcript));
            
            uploadTranscript.on(
            "state_changed",
            (snapshot) => {
                
            },
            (error) => console.log(error),
            () => {
                
                getDownloadURL(transcriptRef).then((transcripturl) => {
                    insertDatabase(transcripturl);
                    UploadedTranscriptHandle("");
                });
                
                
            }
            );
            
            
           
        }

    const downloadFormTemplate = (event) => {
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

    const downloadOfficialLetter = (event) => {
            event.preventDefault();
            let url = LetterUrl;
        
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function(event){
            const blob = xhr.response;
            const blobUrl = window.URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = "official-letter.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        
            window.URL.revokeObjectURL(blobUrl);
            };
            xhr.open("GET", url);
            xhr.send();
        };
        


    
    function GetTranscript(file) {
        UploadedTranscriptHandle(file);
        }

        // const isDocExist = async () => {
        //     const documentRef = doc(applicationsRef, props.userInfo.login.email);
        //     const documentSnapshot = await getDoc(documentRef);
        //     if (documentSnapshot.exists()) {
        //         const documentData = documentSnapshot.data();
        //         const mapObject1 = documentData["Internship-1"];
        //         const mapObject2 = documentData["Internship-2"];
        //         SetApplicationStatus1(mapObject1.status);
        //         SetApplicationStatus2(mapObject2.status);
        //     }
        // }
        // isDocExist();
    


 
         

        
        const renderBoxes = Internships.map((box, index) => {
            return(
             
              
                <div className="box myBox" key={index}>
                        <div className="box-title">
                            <Link className="a-boxtitle" to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                                <span 
                                className="internshipLink"
                                data-json="data/internship.json"
                                >
                                {box.title}
                                </span>
                            </Link>
                        </div>
                        <div className="year div-outer-inboxes">
                            <span className="inbox inner-inbox-title">Year: {box.year}</span>
                        </div>
                        <div className="company div-outer-inboxes">
                            <span className="inbox inner-inbox-title">Company: {box.company}</span>
                        </div>
                        <div className="job-title div-outer-inboxes">
                            <span className="inbox inner-inbox-title">Job Title: {box.jobtitle}</span>
                        </div>
                        <div className="duration div-outer-inboxes">
                            <span className="inbox inner-inbox-title">Duration: {box.duration}</span>
                        </div>
                        <div className="status div-outer-inboxes">
                            <span className="inbox inner-inbox-title">Status: {box.status}</span>
                        </div>
                        </div>
                        
                        
            );
        });

    
    
        return(
            <div>
                <NavBar props={props} NavLocation={'dashboard'}/>
                <main>
                <section id="dashBoard">
                    <div className="dashboard">
                    <h1 className="welcome-MESG">Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
                    <div className="container cont-center"  >
                        {renderBoxes}
                    </div>
                    <div className="statsContainer text-center">
                        
                       <div className="container-fluid-req-downbtsn"> 
                        <div className="btns ">
                            <a onClick={downloadFormTemplate} className="statsBtn btn-down-temp">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                            {LetterUrl &&  
                               <a onClick={downloadOfficialLetter} className="statsBtn btn-down-letter">Download​ Official Letter<i className="fa-solid fa-upload"></i></a>
                            }
                            <h2 className="reqOff">Request​ Official Letter</h2>
                            <form  className="login-form needs-validation" noValidate onSubmit={HandleFileSubmit}>
                            
                             
                                <div className="form-control form-control-css" >
                                <UploadButton className="browse-title" buttonText={"Browse"} filePass={GetTranscript} />
                                  <input
                                  className="uploadTranscript-input"
                                    type="text"
                                    name="uploadTranscript"
                                    id="uploadTranscript"
                                    aria-describedby="uploadTranscript"
                                    placeholder="Upload Transcript"
                                    readOnly
                                    value={transcript ? transcript.name : ""}
                                  />
                                </div>
                                 
                              
                              
                           
                              <button type="submit" className={'send-btn'} style={{ margin: "20px 0px"}}>
                                Request​ Official Letter
                              </button>
                          
                             
                            </form>
                            
                            
                            </div>
                        </div>
                        </div>
                    </div>
                    
            
                </section>
                </main>
            </div>
            
        );
        
    }
    


export default Student;