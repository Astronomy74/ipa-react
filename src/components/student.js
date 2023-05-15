import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { Link } from 'react-router-dom';


function Student(props){
    
    const db = getFirestore();
    // get reference to jobOffers collection
    const jobOffersRef = collection(db, 'jobOffers');
    const [docsArray, setdocsArray] = useState([]);
    useEffect(() => {
        // loop through all documents in the collection
        const qJobs = query(jobOffersRef);
        getDocs(qJobs).then((querySnapshot) => {
          let TempList = [];
          querySnapshot.forEach((doc, index) => {
            const description = doc.data().description;
            const docId = doc.id;
            let docObj = {
              description: description,
              id: docId
            };
            TempList.push(docObj);
          });
          setdocsArray(TempList);
        });
      }, []);
    

    function storeJobId(docId){
        localStorage.setItem("JobId", docId); // save it in local storage
    }

    
    const renderjobs = docsArray.map((doc) => {
        return (
            <div className="box-request" key={doc.id}>
            <h2 id="jobOffer1">
                {doc.description}
            </h2>
            <Link to={`/apply-now/${doc.id}`}><button onClick={() => storeJobId(doc.id)} className="btn apply-now" href="apply-now.html" data-doc-id="">Apply now!</button></Link>
            </div>
            
        );
    });


    const [seeAll, seeAllToggle] = useState('');
    const [seeHide, SeeHideToggle] = useState("See All Form Submissions")
    
    function seeAllToggler(){
        if(!seeAll){
            seeAllToggle(true);
            SeeHideToggle("Hide Form Submissions")
        }else {
            seeAllToggle(false);
            SeeHideToggle("See All Form Submissions")
        }
    }
    
    return(
        <div>
            <NavBar props={props}/>
            <div className="container not">
            <div className="box-not">
                <p>
                Internship Coordinator " Dr. Kristin Abdo" has approved your
                internship request
                </p>
            </div>
            <div className="box-not">
                <p>
                Internship Coordinator " Dr. Kristin Abdo" has approved your
                internship request
                </p>
            </div>
            <a href="see-msg.html" className="" id="seemore">See More</a>
            </div>
            <main>
            <section id="dashBoard">
                <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
                <div className="dashboard">
                <div className="container">
                    <div className="box">
                    <div className="box-title">
                        <a
                        className="internshipLink"
                        href="stats.html"
                        target="_blank"
                        data-json="../data/internship.json"
                        >
                        Internship 1</a>
                        <a
                        className="internshipLink"
                        href="stats.html"
                        target="_blank"
                        data-json="data/internship.json"
                        ><i className="fa-solid fa-right-long"></i></a>
                    </div>
                    <div className="year">
                        <span className="inbox">Year: 2023/2024</span>
                    </div>
                    <div className="company">
                        <span className="inbox">company: Mr. Robot Electronics</span>
                    </div>
                    <div className="job-title">
                        <span className="inbox">Job-Title: Frontend Developer</span>
                    </div>
                    <div className="duration">
                        <span className="inbox">Duration: 3 months</span>
                    </div>
                    <div className="status">
                        <span className="inbox">Status: Done</span>
                    </div>
                    </div>
                    <div className="box">
                    <div className="box-title">
                        <a
                        className="internshipLink"
                        href="stats.html"
                        data-json="data/InternshipTwo.json"
                        >
                        Internship 2</a>
                        <a
                        className="internshipLink"
                        href="stats.html"
                        data-json="data/InternshipTwo.json"
                        ><i className="fa-solid fa-right-long"></i></a>
                    </div>
                    <div className="year" id="year">
                        <span className="inbox">Year:</span>
                    </div>
                    <div className="company" id="company">
                        <span className="inbox">Company:</span>
                    </div>
                    <div className="job-title" id="JobTitle">
                        <span className="inbox">Job Title:</span>
                    </div>
                    <div className="duration" id="duration">
                        <span className="inbox">Duration:</span>
                    </div>
                    <div className="status" id="status">
                        <span className="inbox">Status:</span>
                    </div>
                    </div>
                    <div className="box">
                    <div className="box-title">
                        <a
                        className="internshipLink"
                        href="stats.html"
                        data-json="data/InternshipThree.json"
                        >
                        Voluntary Internship</a>
                        <a
                        className="internshipLink"
                        href="stats.html"
                        data-json="data/InternshipThree.json"
                        ><i className="fa-solid fa-right-long"></i></a>
                    </div>
                    <div className="year">
                        <span className="inbox">Year: 2024/2025</span>
                    </div>
                    <div className="company">
                        <span className="inbox">Company: Undetermined</span>
                    </div>
                    <div className="job-title">
                        <span className="inbox">Job-Title:Undetermined</span>
                    </div>
                    <div className="duration">
                        <span className="inbox">Duration: Undetermined</span>
                    </div>
                    <div className="status">
                        <span className="inbox">Status: Undetermined</span>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <section className="applyforjob" id="applyForJob">
                <div className="container text-center">
                <div className="row">
                    <div className="col-12">
                    <h1>Apply for a job now!</h1>
                    <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                        {renderjobs}
                    </div>
                    </div>
                    <a className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</a>
                </div>
                </div>
                </section>
                </main>
        </div>
    );

}

export default Student;