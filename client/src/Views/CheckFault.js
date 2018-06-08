"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import iconUser from'../img/car.png';
import axios from 'axios';

class CheckFault extends Component {
    constructor(){
        super();

        this.state = {
            email: "",
            vehicleArray: [],
            statusBox: "closed",
            vehModel: "",
            plate_number: "",
            vehVIN: "",
            vehID: "",
            errCodeResp: [],
            errDesc: [],
            errComponentDesc: [],
            errFaultDesc: [],
            gettingDescription: true,
            gettingErrorCodes: true,
            listingVehicles: true
        }
    }

    componentDidMount(){
        this.setState({
            email:this.props.email
        });

        console.log(this.props.email);
        let userEmail = this.props.email;
        let self = this;

        axios.get('https://carmania-tss.herokuapp.com/carmania/allVehicles')
            .then(function (response) {
                console.log(response.data);

                let newArray = response.data.filter(function (el) {
                    return el.email == userEmail;
                });

                console.log(newArray);                
                console.log(this);
                
                self.setState({
                    vehicleArray: newArray,
                    listingVehicles: false
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    checkvin = (data )=> {
        console.log(data.vin);

        let vindetails = {
            vin: data.vin
        }
        this.setState({
            vehModel: data.model,
            plate_number: data.plate_number,
            vehVIN: data.vin,
            vehID: data._id,            
        })

        let url = 'https://carmania-tss.herokuapp.com/carmania/obdCodes';
        axios.post(url, vindetails, {
            data: JSON.stringify(vindetails),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers':'Content-Type, Accept, Access-Control-Allow-Origin'
            }
        })
            .then((response) => {
                var resp = JSON.parse(response.data.message);
                
                console.log(resp);

                this.setState({
                    errCodeResp: resp,
                    gettingErrorCodes: false
                })
                console.log(this.state.errCodeResp);

                let errFaultArray = [];
                let errComponentArray = [];
                let self1 = this;

                resp.forEach(element => {
                    console.log(element.errorCode);
                    let self2 = self1;
                    this.checkDescription(element.errorCode)
                        .then((result)=> {
                            console.log(result);

                            let constructErrorFault = result.fault;
                            let constructErrorComponent = result.system;
                            errFaultArray.push(constructErrorFault);
                            errComponentArray.push(constructErrorComponent);
                            
                            self2.setState({
                                errFaultDesc: errFaultArray,
                                errComponentDesc: errComponentArray,
                                gettingDescription: false
                            })
                            console.log(this.state.errDesc);
                        })
                        .catch(function(error) {
                            console.log('Error: ' + error)
                        })                    
                });

            })
            .catch((e) => {
                console.log(e);
            });

    }

    checkDescription = (errCodeData) =>{
        let self = this;
        return new Promise(function (resolve, reject) {
            let url = `https://carmania-tss.herokuapp.com/carmania/error-codes/?vin=${self.state.vehVIN}&code_id=${errCodeData}&language=EN`;
            let errDescArray = [];
            axios.get(url)
                .then((response) => {
                    var descResp = JSON.parse(response.data.message);
                    errDescArray.push(descResp.dtc_data);
                    console.log(descResp.dtc_data);
                    resolve (descResp.dtc_data);
                }).catch((e) => {
                    console.log(e);
                });
        })
    }

    render() {
        return (
            <div>
                {this.state.statusBox === "open" && (
                    <div>
                        <div className = "vehStatsHead">
                            <h2>Vehicle Status</h2>
                            <button onClick = {()=> {
                                this.setState({
                                    statusBox: "closed",
                                    errCodeResp: [],
                                    errDesc: [],
                                    errComponentDesc: [],
                                    errFaultDesc: [],
                                    gettingDescription: true,
                                    gettingErrorCodes: true,
                                })
                            }
                            }>X</button>
                        </div>
                        {this.state.gettingErrorCodes === true && (
                            <div>
                                <div className = "loaderTable"></div> 
                                <p className = "comm">Communicating With Vehicle(s)...</p>
                            </div> 
                        )}
                        {this.state.gettingErrorCodes === false && (
                            <div className = "vehStats">
                                <div className = "statusLeft">
                                {this.state.errCodeResp.map((errCode, index)=>                         
                                (
                                    <div className = "items">
                                        <div className = "errorcode">
                                            <h2>{errCode.errorCode}</h2>
                                        </div>
                                        <div className = "errDescription">
                                        
                                                {this.state.gettingDescription === true && (
                                                    <p><span className = "loader"></span> Getting Error Description ... </p>
                                                )}
                                                {this.state.gettingDescription === false && (
                                                    <div>
                                                        <h4> Description </h4>
                                                        <p><span>System: </span>{this.state.errComponentDesc[index]}</p>
                                                        <p><span>Fault: </span>{this.state.errFaultDesc[index]}</p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                                    
                                </div>
                                <div className = "statusRight">
                                    <img src={iconUser} alt=""/>
                                    <h3>{this.state.vehModel}</h3>
                                    <p>{this.state.plate_number}</p>
                                </div>
                            </div>
                        )}
                        
                        
                    </div>
                )}
                {this.state.statusBox === "closed" && (
                    <div>
                        <h2>Check Fault</h2>
                        {this.state.listingVehicles === true && (
                            <div>
                                <div className = "loaderTable"></div> 
                                <p className = "comm">Listing your Vehicle(s)...</p>
                            </div> 
                        )}
                        {this.state.listingVehicles === false && (
                            <Table striped>
                                <Table.Header>
                                    <Table.Row className = "TableHead">
                                        <Table.HeaderCell>VIN</Table.HeaderCell>
                                        <Table.HeaderCell>OBD /SIM No.</Table.HeaderCell>
                                        <Table.HeaderCell>Plate Number</Table.HeaderCell>
                                        <Table.HeaderCell>Vehicle Model</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>                        
                                    </Table.Row>
                                </Table.Header>
                            
                                <Table.Body>
                                    {
                                        this.state.vehicleArray.map((vehicle)=>(
                                            <Table.Row key={vehicle.id}>
                                                <Table.Cell>{vehicle.vin}</Table.Cell>
                                                <Table.Cell>{vehicle.ODBnumber}</Table.Cell>
                                                <Table.Cell>{vehicle.plate_number}</Table.Cell>
                                                <Table.Cell>{vehicle.model}</Table.Cell>
                                                <Table.Cell className = "status" onClick = {()=>{
                                                    console.log(vehicle);
                                                    this.setState({
                                                        statusBox:"open"
                                                    })
                                                    this.checkvin(vehicle);
                                                }}>Check Status</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table> 
                        )}                        
                    </div>
                )}                
            </div>
        );
    }
}

export default CheckFault;