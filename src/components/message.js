import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./fireStorage";
import { Link, useNavigate } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'


function Messages(props){

    const [Subject, setSubject] = useState('');
    const [Message, setMessage] = useState('');
    const [Attachment, UploadedAttachment] = useState("");
 
  
  

  function GetAttachment(file) {
    UploadedAttachment(file);
  }



  function HandleFileSubmit() {
    // if(transcript || form){
    //   const storageRef = ref(storage, `internship/${filename}/${props.userInfo.login.email}-${lastItem}-${filename}`);
    //   const uploadTask = uploadBytesResumable(storageRef, eval(filename));
    //   uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //       const prog = Math.round(
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //       );
    //       setProgress(prog);
    //     },
    //     (error) => console.log(error),
    //     () => {
    //       UploadedFromHandle("");
    //       UploadedTranscriptHandle("");
    //     }
    //   );
    // }
  }



  return(
      <main>
          <NavBar props={props}/>
          <div className="container text-center">
            <div className="row align-content-center">
                <div className="col-md-12">
                    <div className="login">
                        <h1>Message</h1>
                        <form className="login-form needs-validation" noValidate onSubmit={HandleFileSubmit}>
                            <div className="mb-3">
                                <input type="subject" name="subject" className="form-control" id="studentID" aria-describedby="Student ID" placeholder="Subject" required  onChange={(e) => setSubject(e.target.value)} />
                                Subject
                            </div>
                            <div className="mb-3">
                                <input type="message" name="message" className="form-control" id="Password" placeholder="Message" required  onChange={(e) => setMessage(e.target.value)} />
                                Message
                            </div>
                        
                          <UploadButton passedClass={"statsBtn"} buttonText={"Upload Attachment"} filePass={GetAttachment} />
                          <button type="submit" className="send-btn">Send Message</button>
                          </form>
                          </div>
                          </div>
                    
                  </div>
              </div>
      </main>
  );
}

export default Messages;

