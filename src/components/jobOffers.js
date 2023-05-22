import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { Link } from 'react-router-dom';

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function JobOffers(props){
    
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

    const renderjobs = docsArray.map((doc) => {
        return (
            <div className="box-request" key={doc.id}>
            <h2 id="jobOffer1">
                {doc.description}
            </h2>
            <Link to={`/details/${doc.id}`}><button onClick={() => storeJobId(doc.id)} className="custom-btn apply-now" data-doc-id="">See Details</button></Link>
            </div>
            
        );
    });

    function storeJobId(docId){
        localStorage.setItem("JobId", docId); // save it in local storage
    }

  

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
            <NavBar props={props} NavLocation={'jobs'}/>
            <main>
            <section id="dashBoard">
            <section className="applyforjob" id="applyForJob">
                <div className="container text-center">
                <div className="row">
                    <div className="col-12">
                    <h1>Available Job Offers</h1>
                    <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                        {renderjobs}
                    </div>
                    </div>
                    <span className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</span>
                </div>
                </div>
            </section>
            </section>
            </main>
        </div>
    );

}

export default JobOffers;