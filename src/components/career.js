import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, orderBy, serverTimestamp, where, addDoc, doc } from "firebase/firestore";
import { storage } from "./fireStorage";
import { Link } from 'react-router-dom';


function Career(props){

    const db = getFirestore();
    const applicationsRef = collection(db, 'applications');
    const [docsArray, setdocsArray] = useState([]);

    useEffect(() => {
        const getMaps = async() => {
        // loop through all documents in the collection
        const qApplications = query(applicationsRef, orderBy("lastactivity", "desc"));
        getDocs(qApplications).then((querySnapshot) => {
          let TempList = [];
          querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            const StudentEmail = doc.id;
            if(data.hasOwnProperty("Internship1") && data["Internship1"].status === "processing"){
                const internshipData = data["Internship1"];
                const form = internshipData.form;
                const note = internshipData.note;
                const studentEmail = StudentEmail;
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
                    internship: "Internship1"
                }
                TempList.push(docObj);
                
            }
            if(data.hasOwnProperty("Internship2") && data["Internship2"].status === "processing"){
                const internshipData = data["Internship2"];
                const form = internshipData.form;
                const note = internshipData.note;
                const studentEmail = StudentEmail;
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
                    internship: "Internship2"
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
                {doc.firstname} {doc.surname} has an approved internship application
                </h2>
                <Link to={"/careerProceed"} onClick={() => passProceedObj(doc)}><button className="custom-btn apply-now" data-doc-id="">Proceed</button></Link>
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
        <main>
        <NavBar props={props} NavLocation={'dashboard'}/>
        <section id="dashBoard">
            <section className="applyforjob" id="applyForJob">
                    <div className="container text-center">
                    <div className="row">
                    <div className="col-12">
                    <h1>Pending SGK Requests</h1>
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

        </main>
    );
    }
}

export default Career;