import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, deleteDoc, where, query } from "firebase/firestore";
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

    const handleDisapprove = async () => {
        const db = getFirestore();
        const requestssRef = collection(db, "request");
        const getRequest = doc(requestssRef, props.request.id);

        await deleteDoc(getRequest);
        navigate('/career-dashboard');
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
                               
                                <button onClick={handleDisapprove} className="disapprove_btn">
                                    Reject
                                </button>
                            </div>
                            <div className="card--wrapper">
                                <h1>Why is it rejected?</h1>
                                <textarea
                                    name="rejection cause"
                                    id="rejection-explaination"
                                    cols="30"
                                    rows="10"
                                    placeholder="Type the rejection reason...."
                                ></textarea>
                                <button className="send-rejetion_btn">
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

export default LetterProcess;