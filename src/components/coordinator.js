import React from "react";
import NavBar from "./navBar";


function Coordinator(props){


    return(
        <div>
        <NavBar props={props}/>
        <div className="container not">
            <div className="box-not">
                <p>
                    Internship Coordinator " Dr. Kristin Abdo" has approved your
                    internship request
                </p>
            </div>
            <div className="box-not">
                <p>
                    Internship Coordinator " Dr. Kristin Abdo" has approved your
                    internship request
                </p>
            </div>
            <a href="#" className="" id="seemore">See More</a>
        </div>

        <main>
            <section className="dashBoard-instructor" id="dashBoardInstructor">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-12">
                            <h1>
                                Hello Dr Kristin Benli
                                <img
                                    src="images/waving-hand-people.png"
                                    alt=""
                                />
                            </h1>
                        </div>
                        <div className="col-md-12 btns">
                            <a href="#fileUpload" className="btn">Upload Form</a>
                            <a href="#openJobsInstructor" className="btn"
                                >see all requests</a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="openJobs-instructor" id="openJobsInstructor">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <h1>Requests</h1>
                            <div className="boxs-request" id="boxsRequest">
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter</a>
                                    <a className="btn" href="#">Evaluate Form</a>
                                </div>
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter </a>
                                    <a className="btn" href="#">Evaluate Form </a>
                                </div>
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter </a>
                                    <a className="btn" href="#">Evaluate Form </a>
                                </div>
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter </a>
                                    <a className="btn" href="#">Evaluate Form </a>
                                </div>
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter </a>
                                    <a className="btn" href="#">Evaluate Form </a>
                                </div>
                                <div className="box-request">
                                    <h2>
                                        Student "Mahmoud Abdelkerim" has sent
                                        their internship form.
                                    </h2>
                                    <a className="btn" href="#">Generate Letter </a>
                                    <a className="btn" href="#">Evaluate Form </a>
                                </div>
                            </div>
                        </div>
                        <a className="btn sub" id="seeAll"
                            >See All Form Submissions</a>
                    </div>
                </div>
            </section>
            <section className="file" id="fileUpload">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pdf-file__wrapper">
                                <img
                                    src="images/file-pdf-regular.svg"
                                    alt="pdf icon"
                                />
                            </div>
                            <div className="buttons__wrapper">
                                <button className="approve_btn">
                                    Sign & Approve
                                </button>
                                <button className="disapprove_btn">
                                    Disapprove & Send Back
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
    );

}

export default Coordinator;