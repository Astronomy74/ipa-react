import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

function SgkProcess(props) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [showSendButton, setShowSendButton] = useState(false);

    const formurl = props.request.form;
    const transcripturl = props.request.transcript;
    const navigate = useNavigate();

    const uploadFileAndChangeStatus = async () => {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `internship/${props.request.studentEmail}/${props.request.internship}/${props.request.studentEmail}-sgk.pdf`);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            console.log(`Uploading`);
          },
          (error) => {
            console.error('Error uploading file:', error);
            // Display error message or handle the error as needed
          },
          async () => {
            // File uploaded successfully
            console.log('File uploaded successfully!');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      
            // Update status in the database
            const db = getFirestore();
            const internship = props.request.internship;
            const applicationsRef = collection(db, 'applications');
            const usersRef = collection(db, 'users');
            const getApplication = doc(applicationsRef, props.request.studentEmail);
      
            try {
              const applicationSnapshot = await getDoc(getApplication);
              const applicationData = applicationSnapshot.data();
              applicationData[internship].status = 'accepted';
              await updateDoc(getApplication, applicationData);
              console.log('Status updated successfully!');

              const querySnapshot = await getDocs(query(usersRef, where('email', '==', props.request.studentEmail)));
              const documentSnapshot = querySnapshot.docs[0];
              const documentId = documentSnapshot.id;

              await updateDoc(doc(usersRef, documentId), {
                letter: downloadURL.toString()
              });
              // Display success message or handle the success as needed
              navigate('/career-dashboard');
            } catch (error) {
              console.error('Error updating status:', error);
              // Display error message or handle the error as needed
            }
          }
        );
      };
    const handleUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        setFileName(uploadedFile.name);
        setShowSendButton(true);
    };

    const downloadTranscript = (event) => {
        const storageRef = ref(storage, `internship/${props.request.studentEmail}/${props.request.internship}/${props.request.studentEmail}-transcript.pdf`);
        event.preventDefault();
        getDownloadURL(storageRef)
          .then((downloadURL) => {
            // Fetch the file using a GET request with responseType: 'blob'
              
              let url = downloadURL;
            
              const xhr = new XMLHttpRequest();
              xhr.responseType = "blob";
              xhr.onload = function(event){
                const blob = xhr.response;
                const blobUrl = window.URL.createObjectURL(blob);
            
                const a = document.createElement('a');
                a.href = blobUrl;
                const email = props.request.studentEmail;
                a.download = `${email}-transcript.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            
                window.URL.revokeObjectURL(blobUrl);
              };
              xhr.open("GET", url);
              xhr.send();
            
          })
          .catch((error) => {
            console.log('Error getting download URL:', error);
          });
      };


    return(
        <div>
            <main>
            <section className="file" id="fileUpload">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pdf-file__wrapper">
                            <embed
                                src={transcripturl}
                                type="application/pdf"
                                width="150%"
                                height="500px"
                            />
                            </div>
                            <div className="buttons__wrapper">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleUpload}
                                style={{ display: 'none' }}
                                id="fileInput"
                            />
                            <label htmlFor="fileInput" className="approve_btn">
                                Upload SGK
                            </label>
                            {showSendButton && (
                                <div>
                                <p>Uploaded File: {fileName}</p>
                                <button onClick={uploadFileAndChangeStatus} className="approve_btn">
                                Send SGK
                                </button>
                                </div>
                            )}
                            <button onClick={downloadTranscript} className="approve_btn">
                                Download Transcript
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

export default SgkProcess;