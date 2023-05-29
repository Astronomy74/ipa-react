import { getFirestore, collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { storage } from "./fireStorage";

function LetterProcess(props) {
   
    return(
        <div>
            <main>
            <section className="file" id="fileUpload">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pdf-file__wrapper">
                            {/* <embed
                                src={url}
                                type="application/pdf"
                                width="150%"
                                height="500px"
                            /> */}
                            </div>
                            <div className="buttons__wrapper">
                                {/* <button onClick={handleApprove} className="approve_btn">
                                    Approve
                                </button>
                                <button onClick={handleDisapprove} className="disapprove_btn">
                                    Disapprove
                                </button> */}
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