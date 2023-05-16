import React, { Component } from 'react';
import Login from './login';
import Student from './student';
import ApplyNow from './applyNow';
import Coordinator from './coordinator';
import Admin from './admin';
import Career from './career';
import { Routes, Route, Navigate, withRouter } from 'react-router-dom';
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
                        <Route exact path="/login" element={<Login loginCollect={loginInfoCollect}/>} />
                        <Route
                            exact path="/student-dashboard"
                            element={
                            isAuthenticated ? (
                                <Student loginCollect={loginInfoCollect} userInfo={LoginInfo} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                            }
                        />
                        
                        <Route 
                            exact path="/apply-now/:id"
                            element={
                                isAuthenticated ? (
                                    <ApplyNow loginCollect={loginInfoCollect}/>
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                        <Route 
                            exact path="/coordinator-dashboard" 
                            element={
                                isAuthenticated ? (
                                    <Coordinator />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                        <Route 
                            exact path="/admin-dashboard"
                            element={
                                isAuthenticated ? (
                                    <Admin />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            } 
                        />
                        <Route 
                            exact path="/career-dashboard" 
                            element={
                                isAuthenticated ? (
                                    <Career />
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