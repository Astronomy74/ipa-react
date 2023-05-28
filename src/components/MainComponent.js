import React, { Component } from 'react';
import Login from './login';
import Student from './student';
import Messages from './messages';
import Conversation from './conversation';
import JobOffers from './jobOffers';
import StudentStats from './stats';
import Details from './details';
import Coordinator from './coordinator';
import Admin from './admin';
import Career from './career';
import AnnounceJobs from './announceJobs';
import Proceed from './proceed';
import { Routes, Route, Navigate } from 'react-router-dom';
import { collectUserInfo, collectInternship } from '../redux/ActionCreators';
import { connect } from 'react-redux';


const msgAccess = ["student", "coordinator"]


const mapStateToProps = state => {
    return {
      LoginInfo: state.StoreLogin,
      InternshipInfo: state.StoreInternship,
    }
}

const mapDispatchToProps = (dispatch) => ({
    loginInfoCollect: (login) => dispatch(collectUserInfo(login)),
    internshipCollect: (login) => dispatch(collectInternship(login)),
});



class Main extends Component {
    constructor(props) {
        super(props);


        this.state = {
            eventTarget: null,
        };
        
    }



    render(){
        
            const { LoginInfo, loginInfoCollect, internshipCollect, InternshipInfo} = this.props;
            //console.log(Object.keys(LoginInfo.login).length !== 0)
           
            return(
                <div className='MainComp' onMouseDown={(e) => this.setState({eventTarget : e.target})}>
                   <Routes>
                        <Route 
                            exact path="/login" 
                            element={
                                !LoginInfo.login ? (
                                        <Login loginCollect={loginInfoCollect}/>
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />
                                    )
                            } 
                        />
                        <Route
                            exact path="/student-dashboard"
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" ? (
                                      <Student loginCollect={loginInfoCollect} internshipCollect={internshipCollect} internshipInfo={InternshipInfo} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/job-offers"
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" ? (
                                      <JobOffers loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/student-dashboard/stats/:title"
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" ? (
                                      <StudentStats loginCollect={loginInfoCollect} userInfo={LoginInfo} internshipCollect={internshipCollect} internshipInfo={InternshipInfo} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/details/:id"
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" ? (
                                        <Details loginCollect={loginInfoCollect} userInfo={LoginInfo}/>
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/coordinator-dashboard" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "coordinator" ? (
                                        <Coordinator loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/proceed" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "coordinator" ? (
                                        <Proceed loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/admin-dashboard" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "admin" ? (
                                        <Admin loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/career-dashboard" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "career" ? (
                                        <Career loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/announceJobs" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "career" ? (
                                        <AnnounceJobs loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/messages" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" || LoginInfo.login.userType === "coordinator" ? (
                                        <Messages loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/conversation/:subject" 
                            element={
                                Object.keys(LoginInfo.login).length !== 0 ? (
                                    LoginInfo.login.userType === "student" || LoginInfo.login.userType === "coordinator" ? (
                                        <Conversation loginCollect={loginInfoCollect} userInfo={LoginInfo} clickTarget={this.state.eventTarget} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            path="*"
                            element={<Navigate to="/login" replace />}
                        />
                    </Routes>
                </div>
            );
        }
        
    }

    export default (connect(mapStateToProps, mapDispatchToProps)(Main));