import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./fireStorage";


function ApplyNow(props){
    const jobId = localStorage.getItem("JobId");
    const [UploadedFile, UploadedFileHandle] = useState('');
    const [progress, setProgress] = useState(0);

    function GetFile(file){
        UploadedFileHandle(file);
        console.log(file)
    }

    function HandleSubmit(){
        const sotrageRef = ref(storage, `images/${UploadedFile.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, UploadedFile)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(prog);
            },
            (error) => console.log(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
              });
            }
          );
    }
    
    return(
        <div>
            <NavBar props={props}/>
            <main className="container jop-application">
            <section className="jop-details">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="com-info">
                                <div className="image">
                                    <img id="jobImg" src="../images/Teknosa_Logo.png" alt="" />
                                </div>
                                <div className="text">
                                    <p id="forWho">For Senior Students</p>
                                    <p>
                                        Required Language(s):
                                        <span id="requiredLanguages"></span>
                                    </p>
                                    <p>Duration: <span id="jobDuration"></span></p>
                                    <p>
                                        Required Skill(s):
                                        <span id="requiredSkills"></span>
                                    </p>
                                    <p>Paid: <span id="paidJob"></span></p>
                                    <p>
                                        Location: <span id="address"></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="map">
                                <iframe id="location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.0131513731553!2d29.036247312002804!3d41.0249682182771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e4b9b96af1%3A0x78ef20ea9ab0de2a!2s%C3%9Csk%C3%BCdar%20University%20Central%20Campus!5e0!3m2!1sen!2str!4v1683022419249!5m2!1sen!2str"
                                    style={{border: 0}}
                                    width="600"
                                    height="450"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                
                            </div>
                        </div>

                        <form action="POST ">
                            <input type="text" required placeholder="First Name" />
                            <input type="text" required placeholder="Last Name" />
                            <input type="text" required placeholder="Age" />
                            <input type="text" required placeholder="Country" />
                            <input type="email" required placeholder="Email" />
                            <input type="text" required placeholder="Phone Number" />
                            <div className="buttons">
                                <UploadButton filePass={GetFile}/>
                                <input onClick={HandleSubmit} type="submit" value="Send" className="btn" />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        </div>
    );

}


export default ApplyNow; 