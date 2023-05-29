import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, orderBy, serverTimestamp, where, addDoc, doc } from "firebase/firestore";
import { storage } from "./fireStorage";
import { Link } from 'react-router-dom';


function Coordinator(props){

    const db = getFirestore();
    // get reference to jobOffers collection
    const applicationsRef = collection(db, 'applications');
    const requestsRef = collection(db, 'request');
    const [docsArray, setdocsArray] = useState([]);
    const [RequestsArray, setRequestsArray] = useState([]);
    useEffect(() => {
        const getMaps = async() => {
        // loop through all documents in the collection
        const qApplications = query(applicationsRef, orderBy("lastactivity", "desc"));
        getDocs(qApplications).then((querySnapshot) => {
          let TempList = [];
          querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            if(data.hasOwnProperty("Internship-1") && data["Internship-1"].status === "pending"){
                const internshipData = data["Internship-1"];
                const form = internshipData.form;
                const note = internshipData.note;
                const studentEmail = internshipData.studentEmail;
                const transcript = internshipData.transcript;
                const firstname = internshipData.firstname;
                const surname = internshipData.surname;
                let docObj = {
                    form: form,
                    note: note,
                    studentEmail: studentEmail,
                    transcript: transcript,
                    firstname: firstname,
                    surname: surname,
                    internship: "Internship-1"
                }
                TempList.push(docObj);
                
            }
            if(data.hasOwnProperty("Internship-2") && data["Internship-2"].status === "pending"){
                const internshipData = data["Internship-2"];
                const form = internshipData.form;
                const note = internshipData.note;
                const studentEmail = internshipData.studentEmail;
                const transcript = internshipData.transcript;
                const firstname = internshipData.firstname;
                const surname = internshipData.surname;
                let docObj = {
                    form: form,
                    note: note,
                    studentEmail: studentEmail,
                    transcript: transcript,
                    firstname: firstname,
                    surname: surname,
                    internship: "Internship-2"
                }
                TempList.push(docObj);
                
            }
          });
          setdocsArray(TempList);
        //   setLoading(false);
        });
        const qReqests = query(requestsRef);
        getDocs(qReqests).then((querySnapshot) => {
            let TempList = [];
            querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            TempList.push(data);
            });
            setRequestsArray(TempList);
        });
}
    getMaps();
}, []);

    const [seeAll, seeAllToggle] = useState('');
    const [seeHide, SeeHideToggle] = useState("See All Requests")
    if(docsArray){
        const renderFormRequests = docsArray.map((doc, index) => {
            return (
                <div className="box-request" key={index}>
                <h2 id="jobOffer1">
                {doc.firstname} {doc.surname} has sent an Internship Form application
                </h2>
                <Link to={"/proceed"} onClick={() => passProceedObj(doc)}><button className="custom-btn apply-now" data-doc-id="">Proceed</button></Link>
            </div>
                
            );
        });
        
        const renderLetterRequests = RequestsArray.map((doc, index) => {
            return (
                <div className="box-request" key={index}>
                <h2 id="jobOffer1">
                {doc.firstname} {doc.surname} has sent an Official Letter Request
                </h2>
                <Link to={"/proceed"} onClick={() => passProceedObj(doc)}><button className="custom-btn apply-now" data-doc-id="">Proceed</button></Link>
            </div>
                
            );
        }); 
        
        
    function seeAllToggler(){
        if(!seeAll){
            seeAllToggle(true);
            SeeHideToggle("Hide Requests")
        }else {
            seeAllToggle(false);
            SeeHideToggle("See All Requests")
        }
    }

    function passProceedObj(doc){
        localStorage.setItem('request', JSON.stringify(doc));
    }
       
    return(
        <div>
        <NavBar props={props} NavLocation={'dashboard'}/>
        <main>
            <section id="dashBoard">
                <section className="applyforjob" id="applyForJob">
                        <div className="container text-center">
                        <div className="row">
                        <div className="col-12">
                        <h1>Pending Form Requests</h1>
                        <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                            {renderFormRequests}
                        </div>
                        <span className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</span>
                        </div>
                        </div>
                        </div>
                </section>
                <section className="applyforjob" id="applyForJob">
                        <div className="container text-center">
                        <div className="row">
                        <div className="col-12">
                        <h1>Pending Official Letter Requests</h1>
                        <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                            {renderLetterRequests}
                        </div>
                        <span className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</span>
                        </div>
                        </div>
                        </div>
                </section>
            </section>
            
        </main>
        </div>
    );
        }
    }
        



export default Coordinator;