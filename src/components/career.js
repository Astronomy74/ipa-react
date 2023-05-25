import React, { useState } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, getDoc, query, setDoc, serverTimestamp, where, addDoc, doc } from "firebase/firestore";


function Career(props){



    return(
        <main>
        <NavBar props={props} NavLocation={'dashboard'}/>
        <section className="AnnounceJob-instructor" id="AnnounceJobInstructor">
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Approved Requests</h1>
                        <div className="boxs-request" id="boxsRequest2">
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK</span>
                            </div>
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK </span>
                            </div>
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK </span>
                            </div>
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK </span>
                            </div>
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK </span>
                            </div>
                            <div className="box-request">
                                <h2>
                                    Student "Mahmoud Abdelkerim" Form was
                                    approved
                                </h2>
                                <span className="btn" href="#">Send to SGK </span>
                            </div>
                        </div>
                    </div>
                    <span className="btn sub" id="seeAll2"
                        >See All Form Submissions</span>
                </div>
            </div>
        </section>

        </main>
    );

}

export default Career;