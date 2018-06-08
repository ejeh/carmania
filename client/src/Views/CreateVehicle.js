"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React, { Component } from 'react';
import axios from 'axios';

class CreateVehicle extends Component {

    constructor(){
        super();

        this.state = { 
            email: "",
            vin: "",
            model: "",
            ODBnumber: "",
            plate_number: "", 
            hasError: "",
            successMessage: "",
            errClassVIN: "",
            errClassOBD: "",
            errClassPlateNo: "",
            isSubmitActive: false
        }
    }
    
    //COLLECTS FORM FIELD VALUES AND SETS STATE
    handleChange = (e) => {
        let change = {}
        change[e.target.name] = e.target.value;
        this.setState(change);
    }

    //SUBMITS FORM VALUES
    handleSubmitVehicle = (event) => {
        this.setState({
            hasError: false,
            errClassVIN: "",
            errClassOBD: "",
            errClassPlateNo: "",
            isSubmitActive: true
        })
        event.preventDefault();
        let details = {
            email: this.state.email,
            vin: this.state.vin,
            model: this.state.model,
            ODBnumber: this.state.ODBnumber,
            plate_number: this.state.plate_number
        }
        console.log(details);

        //PASS VALUES TO THE CREATE VEHICLE FUNCTION
        this.createVehicle(details);
    }
    ClearMessage=()=>{
        this.setState({
            successMessage:""
        })
    }
    closeErr = () =>{
        this.setState({
            hasError: false,
            errClassVIN:"",
            errClassOBD:"",
            errClassPlateNo:""
        })
    }
    componentDidMount(){
        this.setState({
            email:this.props.email
        })
    }


    // CREATE VEHICLE FUNCTION
    createVehicle = (details) => {
        this.setState({
            isRegisterActive: true
        })

        if((this.state.vin === "") || (this.state.ODBnumber === "") || (this.state.plate_number === "")){
            this.setState({
                hasError: 'All Fields marked * are required',
                isRegisterActive: false,
                errClassVIN: "errClass",
                errClassOBD: "errClass",
                errClassPlateNo: "errClass",
                isSubmitActive: false
            })
            return;
        }
        if(this.state.vin.length !== 11){
            this.setState({
                hasError: 'Please Insert the first 11 digits of VIN',
                isRegisterActive: false,
                errClassVIN: "errClass",
                isSubmitActive: false
            })
            return;
        }
        if(this.state.ODBnumber.length !== 11){
            this.setState({
                hasError: 'OBD / SIM number must BE 11 digits',
                isRegisterActive: false,
                errClassOBD: "errClass",
                isSubmitActive: false
            })
            return;
        }      

        
        let url = 'https://carmania-tss.herokuapp.com/carmania/createVehicle';
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
                    successMessage: "Succesfully Added Vehicle",
                    vin:"",
                    model:"",
                    ODBnumber:"",
                    plate_number:"", 
                    isSubmitActive:false                    
                });
        })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        return (
            // ADD VEHICLE FORM
            <div className = "AddVehicleHolder">

                <div className = "addForm">
                    <h2>Add Vehicle</h2>
                    {this.state.successMessage && (
                        <div className = "successMessage">{this.state.successMessage} <span onClick = {this.ClearMessage}>X</span></div>
                    )}
                    {this.state.hasError && (
                        <div className = "errmsg">{this.state.hasError} <span className = "closeErr" onClick = {this.closeErr}>X</span></div>
                    )}
                    <form action="" onSubmit = {this.handleSubmitVehicle}>
                        <div className = "InputFieldRow">
                            <div className = "InputFieldHolder">        
                                <label htmlFor = "vin">VIN (* Insert first 11 digits)</label>
                                <input id = "vin" type = "text" className = {this.state.errClassVIN} placeholder = "VIN" name = "vin" value = {this.state.vin} onChange = {this.handleChange}/>
                            </div>
                        </div>
                        <div className = "InputFieldRow">
                            <div className = "InputFieldHolder">        
                                <label htmlFor = "model">Vehicle Model</label>
                                <input id = "model" type = "text"  placeholder = "Model" name = "model" value = {this.state.model} onChange = {this.handleChange}/>
                            </div>
                        </div>
                        <div className = "InputFieldRow">
                            <div className = "InputFieldHolder">        
                                <label htmlFor = "obdsim">OBD / SIM Number (* Required)</label>
                                <input id = "obdsim" type = "number" className = {this.state.errClassOBD} placeholder = "OBD SIM" name = "ODBnumber" value = {this.state.ODBnumber} onChange = {this.handleChange}/>
                            </div>
                        </div>
                        <div className = "InputFieldRow">
                            <div className = "InputFieldHolder">        
                                <label htmlFor = "platenumber">Plate Number (* Required)</label>
                                <input id = "platenumber" type = "text" className = {this.state.errClassPlateNo} placeholder = "Plate Number" name = "plate_number" value = {this.state.plate_number} onChange = {this.handleChange}/>
                            </div>
                        </div>
                        {this.state.isSubmitActive === true &&(
                            <button className = "createVehicleBtn" disabled type = "submit"> <div className = "loader"></div> </button>
                        )}
                        {this.state.isSubmitActive === false &&(
                            <input className = "createVehicleBtn" type = "submit" value="Create Vehicle"/>
                        )}
                    </form>
                </div>

            </div>
            
        );
    }
}

export default CreateVehicle;