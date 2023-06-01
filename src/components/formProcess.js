import { getFirestore, collection, query, getDocs, setDoc, getDoc, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";

function FormProcess(props) {
    const url = props.request.form;
    const navigate = useNavigate();
    const [popUp, setPopUp] = useState("");
    const [formPopUp, setFormPopUp] = useState("");
    const [Message, setMessage] = useState('');

    // form filling states
    const [Jobtitle, setJobtitle] = useState('');
    const [Company, setCompany] = useState('');
    const [Duration, setDuration] = useState('');
    const [Year, setYear] = useState('');
    


    const db = getFirestore();
   
    const handleDisapprove = async (e) => {
        e.preventDefault();
        const form = e.target;
        const timestamp = new Date(); // Get current timestamp
        const formattedDate = timestamp.toISOString(); // Format timestamp as a string
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
        

        const notificationsRef = collection(db, "notifications");
        const getNotification = doc(notificationsRef, props.request.studentEmail);
        const querySnapshot = await getDoc(query(getNotification));
        const notificationsnData = querySnapshot.data();
        const addedDoc = {
            isRead: false,
            notification: "Your " + props.request.internship + " Form Has Been Rejected"
          };

        const updatedConversationData = {
        ...notificationsnData, // retrieve the items in the conversation
        [formattedDate]: addedDoc, // and here it adds to the properties
        };
    
        await setDoc(getNotification, updatedConversationData);
        

        navigate('/career-dashboard');
    }
}
    const handleApprove = async (e) => {
        e.preventDefault();
        const timestamp = new Date(); // Get current timestamp
        const formattedDate = timestamp.toISOString(); // Format timestamp as a string
        const db = getFirestore();
        const internship = props.request.internship;
        const applicationsRef = collection(db, "applications");
        const getApplication = doc(applicationsRef, props.request.studentEmail);

        const applicationSnapshot = await getDoc(getApplication);
        const applicationData = applicationSnapshot.data();
        
            
        applicationData[internship].status = "processing";
        applicationData[internship].jobtitle = Jobtitle;
        applicationData[internship].company = Company;
        applicationData[internship].duration = Duration;
        applicationData[internship].year = Year;
        
        console.log(applicationData)
        await updateDoc(getApplication, applicationData);  


        const notificationsRef = collection(db, "notifications");
        const getNotification = doc(notificationsRef, props.request.studentEmail);
        const querySnapshot = await getDoc(query(getNotification));
        const notificationsnData = querySnapshot.data();
        const addedDoc = {
            isRead: false,
            notification: "Your " + props.request.internship + " Form Is Now Being Proccessed"
          };

        const updatedConversationData = {
        ...notificationsnData, // retrieve the items in the conversation
        [formattedDate]: addedDoc, // and here it adds to the properties
        };
    
        await setDoc(getNotification, updatedConversationData);
            

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

    function formPopUpToggle(){
        if(!formPopUp){
            setFormPopUp(true);
        }else{
            setFormPopUp(false);
        }
    }
    function formPopUpClose(){
        setFormPopUp(false);
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
                            <div>
                                <span>{props.request.note}</span>
                            </div>
                            <div className="buttons__wrapper">
                                <button onClick={formPopUpToggle} className="approve_btn">
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
                                <textarea
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

                            {/* form filling below */}
                            <div className={"card--wrapper " + (formPopUp ? "open" : "")}>
                            
                                <form className="login-form needs-validation" onSubmit={handleApprove}>
                                <h1>Form Information</h1>
                                <div className="mb-3">
                                <input
                                    type="text"
                                    name="jobtitle"
                                    className="form-control"
                                    id="jobtitle"
                                    aria-describedby="jobtitle"
                                    placeholder="Job Title"
                                    required
                                    value={Jobtitle}
                                    onChange={(e) => setJobtitle(e.target.value)}
                                />
                                </div>
                                <div className="mb-3">
                                <input
                                    type="text"
                                    name="company"
                                    className="form-control"
                                    id="company"
                                    aria-describedby="company"
                                    placeholder="Company"
                                    required
                                    value={Company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                                </div>
                                <div className="mb-3">
                                <input
                                    type="text"
                                    name="duration"
                                    className="form-control"
                                    id="duration"
                                    aria-describedby="duration"
                                    placeholder="Duration"
                                    required
                                    value={Duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                </div>
                                <div className="mb-3">
                                <input
                                    type="text"
                                    name="year"
                                    className="form-control"
                                    id="year"
                                    aria-describedby="year"
                                    placeholder="Year"
                                    required
                                    value={Year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                                </div>
                                
                                <button type="submit" className="send-rejetion_btn">
                                    Send
                                </button>
                                </form>
                                <button onClick={formPopUpClose} className="send-rejetion_btn">
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