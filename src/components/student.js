import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, doc, setDoc } from "firebase/firestore";

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function Student(props){

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
                    <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
                    <div className="dashboard">
                    <div className="container">
                        {renderBoxes}
                    </div>
                    </div>
                </section>
                </main>
            </div>
        );
    }
    

}

export default Student;