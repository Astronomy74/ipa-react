import { getFirestore, collection, getDocs, getDoc, setDoc, updateDoc, doc, deleteDoc, where, query, serverTimestamp, addDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import UploadButton from "./uploadButton";

function LetterProcess(props) {


    const url = props.request.data.transcript;
    const studentEmail = props.request.data.studentEmail;
    const navigate = useNavigate();
    const [Letter, UploadedLetterHandle] = useState("");
    const [popUp, setPopUp] = useState("");
    const [Message, setMessage] = useState('');
    const timestamp = new Date(); // Get current timestamp
    const formattedDate = timestamp.toISOString(); // Format timestamp as a string

    const db = getFirestore();

    const handleDisapprove = async (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity()) {
            const messageData = { // this is the structure I'm using, a map type field in the database
                timestamp: serverTimestamp(), // firebase timestamp function
                isRead: false, // for notifications later
                message: Message, // gets Message from the form box
                sender: props.userInfo.login.email,
                attachmentLink: "",
                attachmentName: "",
                receiver: props.request.data.studentEmail 
              }; 
              const conversationCollectionRef = collection(db, 'conversations');
              const Participants = [props.userInfo.login.email, props.request.data.studentEmail];
              await addDoc(conversationCollectionRef, {
                subject: "Official Letter Request Rejected",
                [formattedDate]: messageData,
                participants: Participants,
                lastactivity: serverTimestamp()
              });


                const notificationsRef = collection(db, "notifications");
                const getNotification = doc(notificationsRef, props.request.studentEmail);
                const querySnapshot = await getDoc(query(getNotification));
                const notificationsnData = querySnapshot.data();
                const addedDoc = {
                    isRead: false,
                    notification: "Your Official Letter Request for " + props.request.internship + " Has Been Rejected"
                  };
        
                const updatedConversationData = {
                ...notificationsnData, // retrieve the items in the conversation
                [formattedDate]: addedDoc, // and here it adds to the properties
                };
            
                await setDoc(getNotification, updatedConversationData);

            const requestssRef = collection(db, "request");
            const getRequest = doc(requestssRef, props.request.id);

            await deleteDoc(getRequest);
            navigate('/career-dashboard');
    }
}
    const handleApprove = async () => {
        if(Letter){
            const db = getFirestore();

            async function insertDatabase(letterUrl){
                const usersCollection = collection(db, "users");
                const querySnapshot = await getDocs(query(usersCollection, where("email", "==", studentEmail)));
  
                querySnapshot.forEach(async (userDoc) => {
                  const userData = userDoc.data();
                  userData.letter = letterUrl;
                  await updateDoc(userDoc.ref, userData);
                });

               

                const notificationsRef = collection(db, "notifications");
                const getNotification = doc(notificationsRef, props.request.studentEmail);
                const querrySnapshot = await getDoc(query(getNotification));
                const notificationsnData = querrySnapshot.data();
                const addedDoc = {
                    isRead: false,
                    notification: "Your Official Letter Request for " + props.request.internship +  " Has Been Approved"
                  };
        
                const updatedConversationData = {
                ...notificationsnData, // retrieve the items in the conversation
                [formattedDate]: addedDoc, // and here it adds to the properties
                };
            
                await setDoc(getNotification, updatedConversationData);


                const requestssRef = collection(db, "request");
                const getRequest = doc(requestssRef, props.request.id);

                await deleteDoc(getRequest);
                navigate('/career-dashboard');
            }

            const Letterextention = Letter.name.split('.').pop().toLowerCase();
            const letterRef = ref(storage, `letters/${studentEmail}/${studentEmail}-${"letter"}.${Letterextention}`);
            const uploadLetter = uploadBytesResumable(letterRef, eval(Letter));
            
            uploadLetter.on(
                "state_changed",
                (snapshot) => {
                   
                },
                (error) => console.log(error),
                () => {
                    
                    getDownloadURL(letterRef).then((letterUrl) => {
                        insertDatabase(letterUrl);
                        UploadedLetterHandle("");
                    });
            
        }
        );
            
        }
    }

    function GetLetter(file) {
        UploadedLetterHandle(file);
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
                                <UploadButton buttonText={"Upload Letter"} filePass={GetLetter} />
                                {Letter &&  
                                <button onClick={handleApprove} className="approve_btn">
                                    Send Letter
                                </button>
                                }
                               
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

export default LetterProcess;