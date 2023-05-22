import React from "react";
import NavBar from "./navBar";


function Career(props){


    return(
        <main>
        <NavBar props={props}/>
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
        <section
            className="EnterJobInfo-instructor"
            id="EnterJobInfoInstructor"
        >
            <div className="job-info">
                <div className="container text-center">
                    <div className="row">
                        <h2>Enter Job Information</h2>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="company-name"
                                    name="company-name"
                                    placeholder="Company Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="Duration"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="minimum-age"
                                    name="minimum-age"
                                    placeholder="Minimum Age"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="job-title"
                                    name="job-title"
                                    placeholder="Job Title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    placeholder="Company Name"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn sub">Announce</button>
                    </div>
                </div>
            </div>
        </section>
        </main>
    );

}

export default Career;