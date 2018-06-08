"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React, {Component} from 'react';
import iconEmail from'../img/email.png';
import iconPassword from'../img/lock.png';
import iconUser from'../img/user.png';
import {Animated} from "react-animated-css";
import { Redirect} from 'react-router-dom';
import axios from 'axios';

class BodyContent extends Component {
    constructor(){
        super();
        this.state = {
            isLogIn: true,
            isSignUp: false,
            isForgotPassword: false,
            email: "",
            password: "",
            confirmPassword: "",
            redirectToUpdate: false,
            redirectToDashboard: false,
            hasError: false,
            isRegisterActive: false,
            isLoginActive: false
        }
    }
    
    
    //CREATE USER FUNCTION
    createUser = (details) => {

        //set button spinner to active
        this.setState({
            isRegisterActive: true
        })

        //CHECK IF REQUIRED FORM FIELDS ARE EMPTY
        if((this.state.email === "") || (this.password === "") || (this.confirmPassword === "")){
            this.setState({
                hasError: 'All Fields are required',
                isRegisterActive: false,
            })
            return;
        }
        //CHECK IF PASSWORD IS LESS THAN 7 CHARACTERS
        if(this.state.password.length < 7){
            this.setState({
                hasError: 'Password should be greater than 6 characters',
                isRegisterActive: false,
            })
            return;
        }
        //CHECK IF PASSWORD IS EQUAL TO CONFIRM PASSWORD
        if(this.state.password !== this.state.confirmPassword){
            this.setState({
                hasError: 'Passwords Do Not match',
                isRegisterActive: false,
            })
            return;
        }
        
        let url = 'https://carmania-tss.herokuapp.com/carmania/CreateUser';
        axios.post(url, details, {
            data: JSON.stringify(details),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers':'Content-Type, Accept, Access-Control-Allow-Origin'
            }
        })
            .then((response) => {
                if(response.data.status === 400){
                    this.setState({
                        hasError: response.data.message,
                        isRegisterActive: false,
                    })
                    return;
                }
                console.log(response);
                this.setState({
                    isRegisterActive: false,
                    redirectToUpdate:true,
                    
                })
            })
            .catch((e) => {
                console.log(e);
            });
    } 

    // LOGIN FUNCTION
    loginUser=(details)=>{
        this.setState({
            isLoginActive: true
        })

        //CHECK IF SIGN IN FIELDS ARE EMPTY
        if(this.state.email === "" || this.password === "" ){
            this.setState({
                hasError: 'All Fields are required',
                isLoginActive: false,
            })
            return;
        }
        //CHECK IF PASSWORD IS LESS THAN 7 CHARACTERS
        if(this.state.password.length < 7){
            this.setState({
                hasError: 'Password should be greater than 6 characters',
                isLoginActive: false,
            })
            return;
        }
                
        let url = 'https://carmania-tss.herokuapp.com/carmania/loginUser';
        axios.post(url, details, {
            data: JSON.stringify(details),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers':'Content-Type, Accept, Access-Control-Allow-Origin'
            }
        })
            .then((response) => {
                console.log(response);

                if(response.data.status === 400){
                    this.setState({
                        hasError: 'Login Failed, Please check your details and try again',
                        isLoginActive: false,
                    })
                    return;
                }
                this.setState({
                    isLoginActive: false,
                    redirectToDashboard:true,
                    
                })
            })
            .catch((e) => {
                console.log(e);
                this.setState({
                    hasError: 'Something Went Wrong, Please Try Again',
                    isLoginActive: false,
                })
            });
    }

    //CONDITIONAL REDIRECT
    renderRedirect = () => {
        if (this.state.redirectToUpdate) {
            return <Redirect to = {`/update/${this.state.email}`}/>
        }
        if (this.state.redirectToDashboard) {
            return <Redirect to = {`/dashboard/${this.state.email}`}/>
        }
    }

    showSignIn = () => {
        this.setState({
            isLogIn: true,
            isSignUp: false,
            isForgotPassword: false,
            email: "",
            password: "",
            confirmPassword: "",
            hasError: false,
        })
    }
    showSignUp = () => {
        this.setState({
            isLogIn: false,
            isSignUp: true,
            isForgotPassword: false,
            email: "",
            password: "",
            confirmPassword: "",
            hasError: false,
        })
    }
    showRecoverForm = () => {
        this.setState({
            isLogIn: false,
            isSignUp: false,
            isForgotPassword: true,
            email: "",
            password: "",
            confirmPassword: "",
            hasError: false,
        })
    }

    closeErr = () => {
        this.setState({
            hasError: false
        })
    }

    handleChange = (e) => {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    handleSubmitSignUp = (event) => {
        event.preventDefault();
        let details = {
            password: this.state.password,
            email: this.state.email
        }
        console.log(details);
        this.createUser(details);
    }
    handleSubmitSignIn = (event) => {
        event.preventDefault();
        let details = {
            password: this.state.password,
            email: this.state.email
        }
        console.log(details);
        this.loginUser(details);
    }


    render(){
        return (
            <div className = "bodyBg">
            {this.renderRedirect()}
                <div className = "tagLine">
                    <h2>VEHICLE DIAGNOSTICS <br/>AT YOUR FINGERTIPS</h2>
                    <p>Monitor, Repair &amp; Improve <br/> the performance of your vehicle</p>
                </div>
                <div className = "formHolder">

                    {/* SIGN IN FORM */}
                    <Animated animationIn = "flipInY" animationOut = "fadeOut" isVisible = {this.state.isLogIn}>
                        <form action = "" className = "logSignForm animated fadeIn" onSubmit = {this.handleSubmitSignIn}>
                            <h3>Sign In</h3>
                            {this.state.hasError && (
                                <div className = "errmsg">{this.state.hasError} <span className = "closeErr" onClick = {this.closeErr}>X</span></div>
                            )}
                            <div className = "inputField">
                                <img className = "icon"  src = {iconEmail}  alt = "email icon"/>
                                <input type = "email" placeholder = "Email Address" value = {this.state.email} name = "email" onChange = {this.handleChange}/>
                            </div>
                            <div className = "inputField">
                                <img className = "icon"  src = {iconPassword}  alt = "password icon" />
                                <input type = "password" placeholder = "Password" value = {this.state.password} name = "password" onChange = {this.handleChange}/>
                            </div>
                        
                        
                            <a href = "#" onClick = {this.showRecoverForm}>Forgot Password? Click Here</a>

                            {this.state.isLoginActive === true &&(
                                <button className = "subBtn" disabled type = "submit"> <div className = "loader"></div> </button>
                            )}
                            {this.state.isLoginActive === false &&(
                                <input className = "subBtn" disabled = {false} type = "submit" value = "Sign In"/>
                            )}

                            <p>or</p>
                            <h4 onClick = {this.showSignUp}>CREATE AN ACCOUNT</h4>
                        </form>
                    </Animated>

                    {/* SIGN UP FORM */}
                    <Animated animationIn = "flipInY" animationOut = "fadeOut" isVisible = {this.state.isSignUp}>
                        <form action = "" className = "logSignForm animated fadeIn" onSubmit = {this.handleSubmitSignUp} >
                            <h3>Sign Up</h3>
                            {this.state.hasError && (
                                <div className = "errmsg">{this.state.hasError} <span className = "closeErr" onClick = {this.closeErr}>X</span></div>
                            )}
                            <div className = "inputField">
                                <img className = "icon"  src = {iconEmail}  alt = "email icon"/>
                                <input type = "email" placeholder = "Email Address" value = {this.state.email} name = "email" onChange = {this.handleChange}/>
                            </div>
                            <div className = "inputField">
                                <img className = "icon"  src = {iconPassword}  alt = "password icon"/>
                                <input type = "password" placeholder = "Password" value = {this.state.password} name = "password" onChange = {this.handleChange}/>
                            </div>
                            <div className = "inputField">
                                <img className = "icon"  src = {iconPassword}  alt = "password icon"/>
                                <input type = "password" placeholder = "Confirm Password" value = {this.state.confirmPassword} name = "confirmPassword" onChange = {this.handleChange}/>
                            </div>                      
                            {this.state.isRegisterActive === true &&(
                                <button className = "subBtn" disabled type = "submit"> <div className = "loader"></div> </button>
                            )}
                            {this.state.isRegisterActive === false &&(
                                    <input className = "subBtn" disabled = {false} type = "submit" value = "Register"/>
                            )}
                            
                            <p>already have an account?</p>
                            <h4 onClick = {this.showSignIn}>SIGN IN</h4>
                        </form>
                    </Animated>

                    {/* RECOVER PASSWORD FORM */}
                    <Animated animationIn = "flipInY" animationOut = "fadeOut" isVisible = {this.state.isForgotPassword}>
                        <form action = "" className = "logSignForm animated fadeIn">
                            <h3>Recover Password</h3>
                            
                            <div className = "inputField">
                                <img className = "icon"  src = {iconEmail}  alt = "email icon"/>
                                <input type = "email" placeholder = "Email Address"/>
                            </div>
                            <input className = "subBtn" type = "submit" value = "Recover Password"/>
                            <p>Type in the Email that you registered with and a recovery link will be sent to you</p>
                            <h4 onClick = {this.showSignIn}>Already Registered? SIGN IN</h4>
                        </form>
                    </Animated>

                </div>
            </div>
        );
    }
    
}

export default BodyContent;
