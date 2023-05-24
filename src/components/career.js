import React from "react";
import NavBar from "./navBar";


function Career(props){


    function handleClick(event) {
        if (event.target.id === "announce") {
          console.log("Announce button clicked");
        }
    }


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
                                    id="description"
                                    name="company-name"
                                    placeholder="Job Description"
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
                                    id="languages"
                                    name="minimum-age"
                                    placeholder="Required Language(s)"
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
                                    placeholder="Location"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="paid"
                                    name="duration"
                                    placeholder="Salary (if job is paid)"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn sub" id="announce" onClick={handleClick}>Announce</button>
                    </div>
                </div>
            </div>
        </section>
        </main>
    );

}

export default Career;