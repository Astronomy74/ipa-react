import { getFirestore, collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";

function FormProcess(props) {
    const url = props.request.form;
    const navigate = useNavigate();
    const [popUp, setPopUp] = useState("");

    const handleDisapprove = async () => {
        const db = getFirestore();
        const internship = props.request.internship;
        const applicationsRef = collection(db, "applications");
        const getApplication = doc(applicationsRef, props.request.studentEmail);

        const applicationSnapshot = await getDoc(getApplication);
        const applicationData = applicationSnapshot.data();
        applicationData[internship].status = "rejected";
        await updateDoc(getApplication, applicationData);
        navigate('/career-dashboard');
    }
    const handleApprove = async () => {
        const db = getFirestore();
        const internship = props.request.internship;
        const applicationsRef = collection(db, "applications");
        const getApplication = doc(applicationsRef, props.request.studentEmail);

        const applicationSnapshot = await getDoc(getApplication);
        const applicationData = applicationSnapshot.data();
        applicationData[internship].status = "processing";
        await updateDoc(getApplication, applicationData);
        navigate('/career-dashboard');
    }

    function popUpToggle(){
        if(!popUp){
            setPopUp(true);
        }else{
            setPopUp(false);
        }
    }

    return(
        <div>
            <main>
            <section className="file" id="fileUpload">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pdf-file__wrapper">
                            <embed
                                src={url}
                                type="application/pdf"
                                width="150%"
                                height="500px"
                            />
                            </div>
                            <div className="buttons__wrapper">
                                <button onClick={handleApprove} className="approve_btn">
                                    Approve
                                </button>
                                <button onClick={popUpToggle} className="disapprove_btn">
                                    Reject
                                </button>
                            </div>
                            <div className={"card--wrapper " + (popUp ? "open" : "")}>
                                <h1>Why is it rejected?</h1>
                                <textarea
                                    name="rejection cause"
                                    id="rejection-explaination"
                                    cols="30"
                                    rows="10"
                                    placeholder="Type the rejection reason...."
                                ></textarea>
                                <button onClick={handleDisapprove} className="send-rejetion_btn">
                                    Send back to student
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </main>
        </div>
    )
}

export default FormProcess;