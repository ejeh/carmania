"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/
// THE NECESSARY COMPONENTS TO VIEW, EDIT AND DELETE A VEHICLE

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import axios from 'axios';
import iconEdit from'../img/edit.png';
import iconDelete from'../img/delete.png';


class ViewVehicle extends Component {
    constructor(){
        super();

        this.state = {
            email: "",
            vehicleArray: [],
            isLoading: true,
            isEditModalOpen: false,
            isDeleteModalOpen: false,
            isDeleteActive: false,
            vehicleIdToDelete: ""
        }
    }

    componentDidMount(){
        this.setState({
            email: this.props.email
        })
        console.log(this.props.email);
        // LOAD USERS VEHICLE 
        this.loadAllVehicles();
    }

    //FUNCTION TO LOAD USER VEHICLES
    loadAllVehicles = () => {        
        let userEmail = this.props.email;
        let self = this;
        axios.get('https://carmania-tss.herokuapp.com/carmania/allVehicles')
            .then(function (response) {
                console.log(response.data);

                let newArray = response.data.filter( function (el) {
                    return el.email == userEmail;
                });
                
                console.log(this);
                if(newArray.length < 1){
                    self.setState({
                        vehicleArray: newArray,
                        isLoading: "empty",
                    }) 
                }
                if(newArray.length > 0){
                    self.setState({
                        vehicleArray: newArray,
                        isLoading: false,
                    }) 
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    //FUNCTION TO DELETE A SELECTED VEHICLE
    deleteVehicle = () => {
        this.setState({
            isDeleteActive: true
        })
        let self2 = this;

        let url = 'https://carmania-tss.herokuapp.com/carmania/deleteVehicle';

        axios.delete(url, {
            data: {
                vin: this.state.vehicleIdToDelete
            }
        })
            .then(function (response) {
                if(response.data._id){
                    self2.setState({
                        isDeleteModalOpen:false,
                        isDeleteActive: false,
                        isLoading:true
                    })
                    self2.loadAllVehicles();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        return (
            <div>
                {/* SHOW LOADER / SPINNER IF VEHICLE IS STILL LOADING */}
                {this.state.isLoading === true && (
                    <div>
                        <div className="loaderTable"></div> 
                        <p className = "comm">Loading Your Vehicle(s)</p>
                    </div>
                )}

                {/* SHOW EMPTY VEHICLE MESSAGE WHEN NO VEHICLE HAS BEEN REGISTERED */}
                {this.state.isLoading === "empty" && (
                    <div><h2 className = "emptyVeh">You have no Registered Vehicles</h2></div> 
                )}

                {/* SHOW DELETE MODAL WHEN DELETE BUTTON HAS BEEN CLICKED */}
                {this.state.isDeleteModalOpen === true && (
                    <div className = "delModal">
                        <div className = "delModalBox">
                            <div className = "delModalTitle"><h3>Delete Vehicle</h3></div>                            
                            <p>Are you sure you want to delete this Vehicle?</p>
                            <div className = "delModalBtns">
                                <button className = "cancelBtn">Cancel</button>
                                {this.state.isDeleteActive === true &&(
                                    <button   disabled > <div className="loader"></div> </button>
                                )}
                                {this.state.isDeleteActive === false &&(
                                     <button onClick = {this.deleteVehicle}>Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SHOW ALL USERS VEHICLE */}
                {this.state.isLoading === false && this.state.isEditModalOpen === false && this.state.isDeleteModalOpen === false && (
                <div>
                <h2>All Vehicles</h2>
                <Table striped>
                     <Table.Header>
                         <Table.Row className = "TableHead">
                             <Table.HeaderCell>VIN</Table.HeaderCell>
                             <Table.HeaderCell>OBD /SIM No.</Table.HeaderCell>
                             <Table.HeaderCell>Plate Number</Table.HeaderCell>
                             <Table.HeaderCell>Vehicle Model</Table.HeaderCell>
                             <Table.HeaderCell></Table.HeaderCell>
                             <Table.HeaderCell></Table.HeaderCell>                    
                         </Table.Row>
                     </Table.Header>
                 
                     <Table.Body>
                         {
                             this.state.vehicleArray.map((vehicle) => (
                                 <Table.Row key = {vehicle.id}>
                                     <Table.Cell>{vehicle.vin}</Table.Cell>
                                     <Table.Cell>{vehicle.ODBnumber}</Table.Cell>
                                     <Table.Cell>{vehicle.plate_number}</Table.Cell>
                                     <Table.Cell>{vehicle.model}</Table.Cell>
                                     <Table.Cell ><img className = "iconAction" src={iconEdit} alt = ""/></Table.Cell>
                                     <Table.Cell ><img className = "iconAction" src={iconDelete} alt = "" onClick = {() => {
                                         this.setState({
                                             vehicleIdToDelete: vehicle.vin,
                                             isDeleteModalOpen: true
                                         })
                                     }}/></Table.Cell>
                                 </Table.Row>
                             ))
                         }
 
                     </Table.Body>
                 </Table>
                 </div>
                )}
            </div>
        );
    }
}

export default ViewVehicle;