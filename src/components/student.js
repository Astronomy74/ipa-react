import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { Link } from 'react-router-dom';

//include Main Css & sCss file
import "../css/main.css";
import "../sass/main.scss";

function Student(props){

    useEffect(() => {
        props.internshipCollect(props.userInfo.login);
    }, []);


    if (props.internshipInfo.internshipList){
        const renderBoxes = props.internshipInfo.internshipList.map((box, index) => {
            return(
                <div className="box" key={index}>
                        <div className="box-title">
                            <Link to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                                <span 
                                className="internshipLink"
                                data-json="data/internship.json"
                                >
                                {box.title}
                                </span>
                            </Link>
                        </div>
                        <div className="year">
                            <span className="inbox">Year: {box.year}</span>
                        </div>
                        <div className="company">
                            <span className="inbox">company: {box.company}</span>
                        </div>
                        <div className="job-title">
                            <span className="inbox">Job-Title: {box.jobtitle}</span>
                        </div>
                        <div className="duration">
                            <span className="inbox">Duration: {box.duration}</span>
                        </div>
                        <div className="status">
                            <span className="inbox">Status: {box.status}</span>
                        </div>
                        </div>
            );
        });
    
    
        return(
            <div>
                <NavBar props={props} NavLocation={'dashboard'}/>
                <main>
                <section id="dashBoard">
                    <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
                    <div className="dashboard">
                    <div className="container">
                        {renderBoxes}
                    </div>
                    </div>
                </section>
                </main>
            </div>
        );
    }
    

}

export default Student;