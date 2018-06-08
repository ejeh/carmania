"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/
// THE NECESSARY COMPONENTS TO UPDATE A USER / STAKEHOLDER
// DETAILS AFTER THEY HAVE SIGNED UP

import React, { Component } from 'react';
import FormInput from '../Components/FormInput';
import iconRepair from'../img/wrench.png';
import iconWarning from'../img/warning.png';
import iconPerformance from'../img/seo.png';
import CheckItem from '../Components/CheckItem';
import { Redirect} from 'react-router-dom';
import axios from 'axios';

class UpdatePage extends Component {
    constructor(){
        super();

        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            companyName: "",
            phone: "",
            userstate: "",
            country: "",
            repairsMaintenance: false,
            safetySecurity: false,
            performanceUpgrade: false,
            isUpdateActive: false,
            redirectToDashboard: false,
            hasError: false
        }
    }

    // COLLECT THE UPDATED DETAILS FROM THE FORM
    handleSubmitUpdateDetails = (event) => {
        event.preventDefault();
        let details = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            companyName: this.state.companyName,
            phone: this.state.phone,
            userstate: this.state.userstate,
            country: this.state.userstate,
            repairsMaintenance: this.state.repairsMaintenance,
            safetySecurity: this.state.safetySecurity,
            performanceUpgrade: this.state.performanceUpgrade,
        }
        // PASS THE DETAILS TO THE UPDATE FUNCTION
        this.updateUser(details);
    }

    // UPDATE THE USER DETAILS IN THE DATABASE
    updateUser = (details) => {
        this.setState({
            isUpdateActive: true
        })
        //CHECK IF REQUIRED FIELDS ARE EMPTY
        if((this.state.firstName === "") || (this.lastName === "") || (this.phone === "")){
            this.setState({
                hasError: 'Fields marked * are required',
                isUpdateActive: false,
            })
            return;
        }
        //CHECK IF A MODULE HAS BEEN SELECTED
        if((this.state.repairsMaintenance === false) && (this.state.safetySecurity === false) && (this.state.performanceUpgrade === false)){
            this.setState({
                hasError: 'You Must select at least one Module',
                isUpdateActive: false,
            })
            return;
        }
        // MAKING THE API CALL TO UPDATE USER
        let url = 'https://carmania-tss.herokuapp.com/carmania/updateUser';
        axios.put(url, details, {
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
                    redirectToDashboard: true,                
                })
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // COLLECT FORM FIELD DETAIL AND SET ITS STATE
    handleChange = (e) => {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    // SET MODULE
    setModule = (e) => {
        let change = {};

        //RUN THROUGH AND CHECK IF MODULES HAVE BEEN ADDED
        if(e.target.name === 'repairsMaintenance'){
            this.setState({
                repairsMaintenance: !this.state.repairsMaintenance
            })
        }
        if(e.target.name === 'safetySecurity'){
            this.setState({
                safetySecurity: !this.state.safetySecurity
            })
        }
        if(e.target.name === 'performanceUpgrade'){
            this.setState({
                performanceUpgrade: !this.state.performanceUpgrade
            })
        }
    }

    // REDIRECT TO DASHBOARD
    renderRedirect = () => {
        if (this.state.redirectToDashboard) {
            return <Redirect to={`/dashboard/${this.state.email}`}/>            
        }
    }

    // CLOSE FORM ERROR MESSAGE IF ANY
    closeErr = () => {
        this.setState({
            hasError: false
        })
    }
    componentDidMount(){
        this.setState({
            email: this.props.match.params.email
        })
    }
    render() {
        console.log(this.props.match.params.email);
        return (
            <div>
                {this.renderRedirect()}
                <form action = "" onSubmit = {this.handleSubmitUpdateDetails}>
                <div id = "updateBox">
                    <div className = "personalForm">
                        <h3 className = "title">Update Details</h3>
                            <div className = "InputFieldRow">
                                <FormInput inputid = "email" type = "email" label = "Email Address" disabled={true} value = {this.state.email}/>
                            </div>
                            <div className = "InputFieldRow">
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "firstname">First Name (* Required)</label>
                                    <input id = "firstname" type = "text" placeholder = "First Name" name = "firstName" value = {this.state.firstName} onChange = {this.handleChange}/>
                                </div>
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "lastname">Last Name (* Required)</label>
                                    <input id = "firstname" type = "text" placeholder = "Last Name" name = "lastName" value = {this.state.lastName} onChange = {this.handleChange}/>
                                </div>
                            </div>
                            <div className = "InputFieldRow">
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "companyname">Company Name</label>
                                    <input id = "companyname" type = "text" placeholder = "Company Name" name = "companyName" value = {this.state.companyName} onChange = {this.handleChange}/>
                                </div>
                            </div>
                            <div className = "InputFieldRow">
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "phone">Phone Number (* Required)</label>
                                    <input id = "phone" type = "number" placeholder = "Phone Number" name = "phone" value = {this.state.phone} onChange = {this.handleChange}/>
                                </div>
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "state">State</label>
                                    <input id = "state" type = "text" placeholder = "State" name = "userstate" value = {this.state.userstate} onChange = {this.handleChange}/>
                                </div>
                                <div className = "InputFieldHolder">        
                                    <label htmlFor = "country">Country</label>
                                    <input id = "country" type = "text" placeholder = "Country" name = "country" value = {this.state.country} onChange = {this.handleChange}/>
                                </div>
                            </div>
                            <div className = "InputFieldRow">
                                <div className = "InputFieldHolder">
                                    <label htmlFor = "about">About</label>
                                    <textarea name = "" id = "about"></textarea>
                                </div>                           
                            </div>
                    </div>
                    <div className = "categoryHolder">
                        <div className = "category">
                            <div className = "items">
                                <div className = "item">
                                    <div className = "head"></div>            
                                    <img src = {iconRepair} alt = {iconRepair}/>
                                    <h4>Repairs &amp; Maintenance</h4>
                                    <CheckItem label = "Full Diagnostics"/>
                                    <CheckItem label = "OBD II Adapter"/>
                                    <CheckItem label = "Easy to Use"/>
                                    {this.state.repairsMaintenance === true &&(
                                        <button className = "moduleAdded" name = "repairsMaintenance" onClick = {this.setModule}>Module Added</button>
                                    )}
                                    {this.state.repairsMaintenance === false &&(
                                        <button  name = "repairsMaintenance" onClick = {this.setModule}>Add Module</button>
                                    )}
                                </div>
                                <div className = "item">
                                    <div className = "head"></div>            
                                    <img src = {iconWarning} alt = {iconWarning}/>
                                    <h4>Safety &amp;<br/> Security</h4>
                                    <CheckItem label = "Vehicle Tracking"/>
                                    <CheckItem label = "Speed Limit"/>
                                    <CheckItem label = "Easy to Use"/>
                                    {this.state.safetySecurity === true &&(
                                        <button className = "moduleAdded" name = "safetySecurity" onClick = {this.setModule}>Module Added</button>
                                    )}
                                    {this.state.safetySecurity === false &&(
                                        <button  name = "safetySecurity" onClick = {this.setModule}>Add Module</button>
                                    )}
                                </div>
                                <div className = "item">
                                    <div className = "head"></div>            
                                    <img src = {iconPerformance} alt = {iconPerformance}/>
                                    <h4>Performance &amp;<br/> Upgrade</h4>
                                    <CheckItem label = "Vehicle Tuning"/>
                                    <CheckItem label = "Fuel Check"/>
                                    <CheckItem label = "Easy to Use"/>

                                    {this.state.performanceUpgrade === true &&(
                                        <button className = "moduleAdded" name = "performanceUpgrade" onClick = {this.setModule}>Module Added</button>
                                    )}
                                    {this.state.performanceUpgrade === false &&(
                                        <button  name = "performanceUpgrade" onClick = {this.setModule}>Add Module</button>
                                    )}
                                </div>                            
                            </div>
                            
                        </div>
                        <div className = "category2">
                            {this.state.isUpdateActive === true &&(
                                <button id = "updateBtn"  disabled type = "submit"> <div className = "loader"></div> </button>
                            )}
                            {this.state.isUpdateActive === false &&(
                                <input type = "submit" id = "updateBtn"  value = "Update Details"/>
                            )}
                            {this.state.hasError && (
                                <div className = "errmsg">{this.state.hasError} <span className = "closeErr" onClick = {this.closeErr}>X</span></div>
                            )}
                        </div>
                    </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default UpdatePage;