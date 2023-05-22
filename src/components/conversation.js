import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, listAll, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, getDoc, query, setDoc, serverTimestamp, where, addDoc, doc } from "firebase/firestore";

//stats sCss
import '../sass/stas.scss'


function Conversation(props){
    const lastItem = useLocation().pathname.split("/").pop();
    
    const [Subject, setSubject] = useState('');
    const [Message, setMessage] = useState('');
    const [Attachment, UploadedAttachment] = useState("");
    const [progress, setProgress] = useState(0);
    const [UpdateDetect, UpdateDetector] = useState(null);
    
    const db = getFirestore();
    const handleSubmit = async (e) => {
      e.preventDefault();

    
    const timestamp = new Date(); // Get current timestamp
    const formattedDate = timestamp.toISOString(); // Format timestamp as a string


    const submitMessage = async (attachmentLink, attachmentName) => {

      const messageData = { // this is the structure I'm using, a map type field in the database
            sender: props.userInfo.login.email,
            receiver: 'coordinator@example.com', // replace later with real coordinator email
            timestamp: serverTimestamp(), // firebase timestamp function
            isRead: false, // for notifications later
            message: Message, // gets Message from the form box
            attachmentName: attachmentName || '',
            attachmentLink: attachmentLink || '',
          };
  
  
      // every entry will have participants, so we can fetch correctly
      const Participants = [props.userInfo.login.email, 'coordinator@example.com'];
      
      try {
        const conversationCollectionRef = collection(db, 'conversations');
        // // check if a document with the same subject exists, cuz it'll be updated if true
        // const querySnapshot = await getDocs(query(conversationCollectionRef, where('subject', '==', Subject)));
        
        if (lastItem === 'new') {

          // if no existing conversation with the same subject, create a new document
          const newConversationRef = await addDoc(conversationCollectionRef, {
            subject: Subject,
            [formattedDate]: messageData,
            participants: Participants,
          });
          console.log('new conversation created with id:', newConversationRef.id);
        } 
        else {
          const conversationDocRef = doc(conversationCollectionRef, lastItem);
          const querySnapshot = await getDoc(query(conversationDocRef));
          const conversationData = querySnapshot.data();
          
          const updatedConversationData = {
            ...conversationData, // retrieve the items in the conversation
            [formattedDate]: messageData, // and here it adds to the properties
          };
      
          await setDoc(conversationDocRef, updatedConversationData);
        }
      
        console.log('message submitted successfully.');
      
        // clear form inputs
        setSubject('');
        setMessage('');
        UpdateDetector('');
      } catch (error) {
        console.error('error submitting message:', error);
      }
    }
    
    // Handle Attachment
    
    if (Attachment) {
      const storageRef = ref(storage, `conversations/`);
      const folderName = lastItem;
  
      try {
        const res = await listAll(storageRef);
        const existingFolder = res.prefixes.find((prefix) => prefix.name === folderName);
        let uploadFolderRef = '';
  
        if (existingFolder) {
          // Folder with the same name already exists, save inside the existing folder
          uploadFolderRef = ref(storage, `${existingFolder.fullPath}/${formattedDate}`);
        } else {
          // Folder with the same name doesn't exist, create a new folder
          uploadFolderRef = ref(storage, `conversations/${folderName}/${formattedDate}`);
        }
        const uploadTask = uploadBytesResumable(uploadFolderRef, Attachment);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(prog);
          },
          (error) => console.log(error),
          () => {
            UploadedAttachment("");
          // Get the download URL of the uploaded file
            getDownloadURL(uploadFolderRef).then((url) => {
              let downloadURL = url;
              let attachmentName = Attachment.name;

            // Proceed with message submission or any other action here
            submitMessage(downloadURL, attachmentName);
          });
          }
          );
          } catch (error) {
          // Handle error
          console.error("Error handling attachment:", error);
          }
          } else {
          // No attachment, proceed with message submission or any other action here
          submitMessage("");
          }

    }
  
    // ...
  

  function GetAttachment(file) {
    UploadedAttachment(file);
  }

  const [conversation, setConversation] = useState([]);

  useEffect(() => {
  const db = getFirestore();
  const conversationsCollection = collection(db, "conversations");
  const conversationDocRef = doc(conversationsCollection, lastItem);
  getDoc(conversationDocRef)
  .then((querySnapshot) => {
      const conversationsCollect = querySnapshot.data();
      const filteredConv = [];
      Object.keys(conversationsCollect).forEach((key) => {
        const value = conversationsCollect[key];
        if(key !== 'participants' && key !== 'subject'){
          filteredConv.push(value);
        }
      });
      UpdateDetector(null);
      setConversation(filteredConv)
      

  })
  .catch((error) => {
      console.log("Error getting documents: ", error); // if fetching documents failed
  });
  }, [UpdateDetect]);


  const renderConversation = conversation
  .sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate()) // Sort by timestamp
  .map((entry) => {
    const msgDate = entry.timestamp.toDate();
    const formattedDate = msgDate.toLocaleDateString(); // Format the date
    const formattedTime = msgDate.toLocaleTimeString(); // Format the time

  
    return(
        <div className="box" key={msgDate}>
            <div className="box-title">
                {/* <Link to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                    <span 
                    className="internshipLink"
                    data-json="data/internship.json"
                    >
                    {box.title}
                    </span>
                </Link> */}
                <span>{entry.sender}</span>
                <span>{formattedDate} {formattedTime}</span>
                <div>
                  <div>
                  {entry.message}
                  </div>
                  <div>
                  <a href={entry.attachmentLink}><span>{entry.attachmentName}</span></a>
                  </div>
                </div>
            </div>
        </div>
    );
});



  return(
      <main>
          <NavBar props={props}/>
          <div className="container text-center">
            <div className="row align-content-center">
                <div className="col-md-12">
                    <div className="login">
                        <h1>Message</h1>
                        {renderConversation}
                        <form className="login-form needs-validation" noValidate onSubmit={handleSubmit}>
                          {lastItem === 'new' ? (
                              <div className="mb-3">
                              <input
                                type="text"
                                name="subject"
                                className="form-control"
                                id="subject"
                                aria-describedby="Subject"
                                placeholder="Subject"
                                required
                                value={Subject}
                                onChange={(e) => setSubject(e.target.value)}
                              />
                              Message
                              </div>
                            ) : (
                              <div></div>
                            )}
                          <div className="mb-3">
                            <input
                              type="text"
                              name="message"
                              className="form-control"
                              id="message"
                              placeholder="Message"
                              required
                              value={Message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            Message
                          </div>
                          {/* Your other JSX code */}
                          <div className="btns">
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Attachment"} filePass={GetAttachment} />
                          {Attachment && <span>{Attachment.name}</span>}
                          <button type="submit" className="send-btn">
                            Send Message
                          </button>
                          </div>
                        </form>
                        </div>
                        </div>
                    
                  </div>
              </div>
      </main>
  );
}

export default Conversation;






