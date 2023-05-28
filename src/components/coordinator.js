import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, orderBy, serverTimestamp, where, addDoc, doc } from "firebase/firestore";
import { storage } from "./fireStorage";


function Coordinator(props){

    const db = getFirestore();
    // get reference to jobOffers collection
    const applicationsRef = collection(db, 'applications');
    const [docsArray, setdocsArray] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    surname: surname
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
                    surname: surname
                }
                TempList.push(docObj);
                
            }
          });
          setdocsArray(TempList);
        //   setLoading(false);
        });
}
    getMaps();
}, []);

    const [seeAll, seeAllToggle] = useState('');
    const [seeHide, SeeHideToggle] = useState("See All Requests")
    if(docsArray){
        const renderjobs = docsArray.map((doc, index) => {
            return (
                <div className="box-request" key={index}>
                <h2 id="jobOffer1">
                {doc.firstname} {doc.surname} has sent an Internship Form application
                </h2>
                <button className="custom-btn apply-now" data-doc-id="">Proceed</button>
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
       
    return(
        <div>
        <NavBar props={props} NavLocation={'dashboard'}/>
        <main>
            <section id="dashBoard">
            <section className="applyforjob" id="applyForJob">
                    <div className="container text-center">
                    <div className="row">
                    <div className="col-12">
                    <h1>Pending Student Requests</h1>
                    <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                        {renderjobs}
                    {/* {loading ? (
                        <p>Loading...</p>
                    ) : (
                        docsArray.map((doc, index) => (
                        <div className="box-request" key={index}>
                            <h2 id="jobOffer1">
                            {doc.firstname} {doc.surname} has sent an Internship Form application
                            </h2>
                            <button className="custom-btn apply-now" data-doc-id="">Proceed</button>
                        </div>
                    ))
                    )}                   */}
                    </div>
                    <span className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</span>
                    </div>
                    </div>
                    </div>
                </section>
                </section>
            {/* </section>
            <section className="file" id="fileUpload">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pdf-file__wrapper">
                                <img
                                    src="images/file-pdf-regular.svg"
                                    alt="pdf icon"
                                />
                            </div>
                            <div className="buttons__wrapper">
                                <button className="approve_btn">
                                    Sign & Approve
                                </button>
                                <button className="disapprove_btn">
                                    Disapprove & Send Back
                                </button>
                            </div>
                            <div className="card--wrapper">
                                <h1>Why is it rejected?</h1>
                                <textarea
                                    name="rejection cause"
                                    id="rejection-explaination"
                                    cols="30"
                                    rows="10"
                                    placeholder="Type the rejection reason...."
                                ></textarea>
                                <button className="send-rejetion_btn">
                                    Send back to student
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </main>
        </div>
    );
        }
    }
        



export default Coordinator;