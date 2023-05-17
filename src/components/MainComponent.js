import React, { Component } from 'react';
import Login from './login';
import Student from './student';
import StudentStats from './stats';
import ApplyNow from './applyNow';
import Coordinator from './coordinator';
import Admin from './admin';
import Career from './career';
import { Routes, Route, Navigate } from 'react-router-dom';
import { collectUserInfo } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import fireApp from './fireStorage';


const mapStateToProps = state => {
    return {
      LoginInfo: state.StoreLogin,
    }
}

const mapDispatchToProps = (dispatch) => ({
    loginInfoCollect: (login) => dispatch(collectUserInfo(login)),
});



class Main extends Component {
   

    render(){
            const { LoginInfo, loginInfoCollect } = this.props;
            const isAuthenticated = Object.keys(LoginInfo).length !== 0;
            return(
                <div className='MainComp'>
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
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "student" ? (
                                      <Student loginCollect={loginInfoCollect} userInfo={LoginInfo} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/student-dashboard/stats"
                            element={
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "student" ? (
                                      <StudentStats loginCollect={loginInfoCollect} userInfo={LoginInfo} />
                                    ) : (
                                        <Navigate to={`/${LoginInfo.login.userType}-dashboard`} replace />

                                    )
                                  ) : (
                                    <Navigate to="/login" replace />
                                  )
                            }
                        />
                        <Route
                            exact path="/apply-now/:id"
                            element={
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "student" ? (
                                        <ApplyNow loginCollect={loginInfoCollect}/>
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
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "coordinator" ? (
                                        <Coordinator loginCollect={loginInfoCollect}/>
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
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "admin" ? (
                                        <Admin loginCollect={loginInfoCollect}/>
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
                                isAuthenticated && LoginInfo.login ? (
                                    LoginInfo.login.userType === "career" ? (
                                        <Career loginCollect={loginInfoCollect}/>
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