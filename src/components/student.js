import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { Link } from 'react-router-dom';

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function Student(props){
    
    // const db = getFirestore();
    // // get reference to jobOffers collection
    // const jobOffersRef = collection(db, 'jobOffers');
    // const [docsArray, setdocsArray] = useState([]);
    // useEffect(() => {
    //     // loop through all documents in the collection
    //     const qJobs = query(jobOffersRef);
    //     getDocs(qJobs).then((querySnapshot) => {
    //       let TempList = [];
    //       querySnapshot.forEach((doc, index) => {
    //         const description = doc.data().description;
    //         const docId = doc.id;
    //         let docObj = {
    //           description: description,
    //           id: docId
    //         };
    //         TempList.push(docObj);
    //       });
    //       setdocsArray(TempList);
    //     });
    //   }, []);
    

    const BoxesArray = [
        {
            title: 'Internship1',
            year: '2024/2025',
            company: 'Teknosa',
            jobTitle: 'Intern',
            duration: '3 Months',
            status: 'Done'
        },
        {
            title: 'Internship1',
            year: '2024/2025',
            company: 'Teknosa',
            jobTitle: 'Intern',
            duration: '3 Months',
            status: 'Done'
        },
        {
            title: 'Internship1',
            year: '2024/2025',
            company: 'Teknosa',
            jobTitle: 'Intern',
            duration: '3 Months',
            status: 'Done'
        },
    ]

    const renderBoxes = BoxesArray.map((box) => {
        return(
            <div className="box">
                    <div className="box-title">
                        <Link to={`/student-dashboard/stats`}>
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
                        <span className="inbox">company: {box.company}</span>
                    </div>
                    <div className="job-title">
                        <span className="inbox">Job-Title: {box.jobTitle}</span>
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

export default Student;