import React, { useState, useEffect } from "react";
import NavBar from "./navBar";

//stats sCss
import '../sass/stas.scss'


function StudentStats(props){
    return(
        <main>
            <NavBar props={props}/>
            <h1>Welcome {props.userInfo.login ? props.userInfo.login.firstname + ' ' + props.userInfo.login.surname : ''}</h1>
            <div className="statsContainer text-center">
              <div className="card">
                <div className="card-header">
                  Hint <i className="fa-solid fa-lightbulb"></i>
                </div>
                <div className="card-body">
                  <p>Press <code>Spacebar</code> to change between internships.</p>
                </div>
              </div>
                <div className="row g-0">
                    <div className="col-12">
                        <div className="app">
                            <h1>Application Process</h1>
                        </div>
                        <div className="intern-btns">
                            <div className="btns-top text">
                                <a className="intern-btn active" id="button1" data-json="../data/internship.json">Internship 1</a>
                                <a className="intern-btn"        id="button2" data-json="../data/InternshipTwo.json">Internship 2</a>
                                <a className="intern-btn"        id="button3" data-json="../data/InternshipThree.json">Internship 3</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 boxs">
                        <div className="box" id="yearApp" style={{order: 4}}>
                            <h2>Year</h2>
                            <p></p>
                        </div>
                        <div className="box" id="companyApp" style={{order: 2}}>
                            <h2>Company</h2>
                            <p></p>
                        </div>
                        <div className="box" id="statusApp" style={{order: 5}}>
                            <h2>Status</h2>
                            <p></p>
                        </div>
                        <div className="box" id="durationApp" style={{order: 3}}>
                            <h2>Duration</h2>
                            <p></p>
                        </div>
                        <div className="box" id="JobTitleApp">
                            <h2>Job title</h2>
                            <p></p>
                        </div>
                </div>
            </div>
                    <div className="col-md-12">
                        <div className="btns">
                            <a className="statsBtn" href="pdf/templatepdf.pdf" download>Download Form<i className="fa-solid fa-upload"></i></a>
                            <a className="statsBtn">Send Form <i className="fa-solid fa-paper-plane"></i></a>
                            <a className="statsBtn">Request Official Letter<i className="fa-solid fa-upload"></i></a>
                            <a className="statsBtn">Upload Transcript<i className="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </div>
        </main>
    );
}

export default StudentStats;