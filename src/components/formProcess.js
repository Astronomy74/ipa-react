import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";

function FormProcess(props) {
    const url = props.request.form;
    const navigate = useNavigate();
    const [popUp, setPopUp] = useState("");
    const [Message, setMessage] = useState('');
    const timestamp = new Date(); // Get current timestamp
    const formattedDate = timestamp.toISOString(); // Format timestamp as a string

    const db = getFirestore();

    const handleDisapprove = async (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity()) {
            // Form is valid, process the submission

        const messageData = { // this is the structure I'm using, a map type field in the database
            timestamp: serverTimestamp(), // firebase timestamp function
            isRead: false, // for notifications later
            message: Message, // gets Message from the form box
            sender: props.userInfo.login.email,
            attachmentLink: "",
            attachmentName: "",
            receiver: props.request.studentEmail 
          }; 
          const conversationCollectionRef = collection(db, 'conversations');
          const Participants = [props.userInfo.login.email, props.request.studentEmail];
          await addDoc(conversationCollectionRef, {
            subject: "Internship Form Rejected",
            [formattedDate]: messageData,
            participants: Participants,
            lastactivity: serverTimestamp()
          });

        const internship = props.request.internship;
        const applicationsRef = collection(db, "applications");
        const getApplication = doc(applicationsRef, props.request.studentEmail);

        const applicationSnapshot = await getDoc(getApplication);
        const applicationData = applicationSnapshot.data();
        applicationData[internship].status = "rejected";
        await updateDoc(getApplication, applicationData);
        
        navigate('/career-dashboard');
    }
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
    function popUpClose(){
        setPopUp(false);
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
                                
                                <form className="login-form needs-validation" onSubmit={handleDisapprove}>
                                <h1>Why is it rejected?</h1>
                                <div className="mb-3">
                                <textArea
                                    type="text"
                                    name="message"
                                    className="form-control"
                                    id="message"
                                    placeholder="Type the rejection reason...."
                                    required
                                    value={Message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                </div>
                                <button type="submit" className="send-rejetion_btn">
                                    Send
                                </button>
                                </form>
                                <button onClick={popUpClose} className="send-rejetion_btn">
                                    Cancel
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