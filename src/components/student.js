import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { Link } from 'react-router-dom';
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function Student(props){

    const [Note, setNote] = useState('');
    const [docExist, setDocExist] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        props.internshipCollect(props.userInfo.login);
    }, []);
    

    const db = getFirestore();
    const internshipsRef = collection(db, 'internships')
    const qInternships = query(internshipsRef);
    getDocs(qInternships).then((querySnapshot) => {
        const documents = querySnapshot.docs;
        const hasLoginEmail = documents.some((doc) => doc.id === props.userInfo.login.email);
        if (!hasLoginEmail) {
            const newDocRef = doc(internshipsRef, props.userInfo.login.email);
            setDoc(newDocRef, {})
            const subcollectionRef = collection(newDocRef, "all-internships");
            const doc1Id = "internship1";
            const doc2Id = "internship2";
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
            const doc1Ref = doc(subcollectionRef, doc1Id);
            const doc2Ref = doc(subcollectionRef, doc2Id);
            setDoc(doc1Ref, doc1Data)
            setDoc(doc2Ref, doc2Data)

        }});

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

          const isDocExist = async () => {
            // const documentRef = doc(applicationsRef, props.userInfo.login.email);
            // const documentSnapshot = await getDoc(documentRef);
            // if (documentSnapshot.exists()) {
            //   const documentData = documentSnapshot.data();
            //   const mapObject = documentData[lastItem];
            
            //   if (mapObject && (mapObject.status === "processing" || mapObject.status === "pending")) {
            //     setDocExist(true);
            //     setDisplayText("You already have an application in process");
            //   }
            //   else if (mapObject && (mapObject.status === "accepted")){
            //     setDocExist(true);
            //     setDisplayText("Your application is already accepted")
            //   }
            // }
          };
          
          const isFormDisabled = () => {
            // isDocExist();
            // if (docExist === true) {
            //   return true;
            // }
            // else return false;
          }
         

    if (Object.keys(props.internshipInfo.internshipList).length !== 0){
        
        const renderBoxes = props.internshipInfo.internshipList.map((box, index) => {
            return(
                <div className="box" key={index}>
                        <div className="box-title">
                            <Link to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                                <span 
                                className="internshipLink"
                                data-json="data/internship.json"
                                >
                                {box.title}
                                </span>
                            </Link>
                        </div>
                        <div className="year">
                            <span className="inbox">Year: {box.year}</span>
                        </div>
                        <div className="company">
                            <span className="inbox">Company: {box.company}</span>
                        </div>
                        <div className="job-title">
                            <span className="inbox">Job Title: {box.jobtitle}</span>
                        </div>
                        <div className="duration">
                            <span className="inbox">Duration: {box.duration}</span>
                        </div>
                        <div className="status">
                            <span className="inbox">Status: {box.status}</span>
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
                    <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
                    <div className="container">
                        {renderBoxes}
                    </div>
                    <div className="statsContainer text-center">
                        <div className="col-md-12">
                        <div className="btns">
                            <a onClick={downloadFile} className="statsBtn">Download​ Form Temp​late<i className="fa-solid fa-upload"></i></a>
                            
                        </div>
                        <h2>Submit Application</h2>
                        <form className="login-form needs-validation" noValidate>
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
                            <UploadButton buttonText={"Browse"} />
                              <input
                                type="text"
                                name="uploadTranscript"
                                id="uploadTranscript"
                                aria-describedby="uploadTranscript"
                                placeholder="Upload Transcript"
                                readOnly
                                
                              />
                            </div>
                          </div>
                          <div className="btns">
                          {isFormDisabled() && <p className="disabled-text">{displayText}</p>}
                            <button type="submit" className="send-btn" disabled={isFormDisabled() || disabled}>
                                Submit
                            </button>
                            
                          </div>
                        </form>
                        </div>
                    </div>
                </div>
                </section>
                </main>
            </div>
        );
    }
    

}

export default Student;