"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import Welcome from './Welcome';
import CreateVehicle from './CreateVehicle';
import ViewVehicle from './ViewVehicle';
import CheckFault from './CheckFault';

class DashboardPage extends Component {

    constructor(){
        super();

        this.state = { 
            sidebarOpen: "" ,
            openedView:"welcome"
        };
    }    
    //COLLECTS FORM FIELD VALUES ON CHANGE AND SETS STATE
    handleViewChange = (e) => {
        console.log(e.target.name)
        this.setState({
            openedView: e.target.name
        })
    }

    // TOGGLE SIDEBAR
    toggleSideBar = () => {
        if(this.state.sidebarOpen === ""){
            this.setState({
                sidebarOpen: 'active'
            });
            return;
        }
        if(this.state.sidebarOpen === "active"){
            this.setState({
                sidebarOpen: ''
            });
            return;
        }
    }
    componentDidMount(){
        this.setState({
            email: this.props.match.params.email
        })
    }

    render() {
        let sidebarContent = <b>Sidebar content</b>;
        return (
            // BEGIN SIDEBAR COMPONENT
            <div className = "wrapper">
                <nav id = "sidebar" className = {this.state.sidebarOpen}>            
                    <div className = "sidebar-header" >
                    <a href = "#" name = "welcome" onClick = {this.handleViewChange} id = "headTitle">CARMANIA</a>
                        <strong>CM</strong>
                        <p>{this.state.email}</p>
                    </div>

                    <ul className = "list-unstyled components">
                        <li className = "active">
                            <a className = "menuBtn" href = "#homeSubmenu" data-toggle = "collapse" aria-expanded = "false">
                                <i className = "glyphicon glyphicon-home"></i>
                                Vehicle
                            </a>
                            <ul className = "collapse list-unstyled" id = "homeSubmenu">
                                <li><a href = "#" className = "menuBtn" name = "viewvehicle" onClick = {this.handleViewChange}>View All</a></li>
                                <li><a href = "#" className = "menuBtn" name = "createvehicle" onClick = {this.handleViewChange}>Create Vehicle</a></li>
                            </ul>
                        </li>
                        <li>
                            <a className = "menuBtn" href = "#repairSubmenu" data-toggle = "collapse" aria-expanded = "false">
                                <i className = "glyphicon glyphicon-duplicate"></i>
                                Repairs &amp; Maintenance
                            </a>
                            <ul className = "collapse list-unstyled" id = "repairSubmenu">
                                <li><a href = "#" className = "menuBtn" name = "checkfault" onClick = {this.handleViewChange}>Check Faults</a></li>

                            </ul>
                        </li>
                        <li>
                            <a className = "menuBtn" href = "#safetySubmenu" data-toggle = "collapse" aria-expanded = "false">
                                <i className = "glyphicon glyphicon-duplicate"></i>
                                Safety &amp; Security
                            </a>
                            <ul className = "collapse list-unstyled" id = "safetySubmenu">
                                <li><a href = "#" className = "menuBtn">Track Vehicle</a></li>
                                <li><a href = "#" className = "menuBtn">Speed Diagnostics</a></li>
                            </ul>
                        </li>
                        <li>
                            <a className = "menuBtn" href = "#performanceSubmenu" data-toggle = "collapse" aria-expanded = "false">
                                <i className = "glyphicon glyphicon-duplicate"></i>
                                Performance &amp; Upgrade
                            </a>
                            <ul className = "collapse list-unstyled" id = "performanceSubmenu">
                                <li><a href = "#" className = "menuBtn">Vehicle Status</a></li>
                                <li><a href = "#" className = "menuBtn">Fuel Consumption</a></li>
                            </ul>
                        </li>
                        <li>
                            <a className = "menuBtn" href = "#">
                                <i className = "glyphicon glyphicon-send"></i>
                                User Profile
                            </a>
                        </li>
                    </ul>
                </nav>

            {/* CONTENT AREA */}
            <div id = "content">

                <nav className = "navbar navbar-default">
                    <div className = "container-fluid">

                        <div className = "navbar-header">
                            <button type="button" id = "sidebarCollapse" className = "btn btn-info navbar-btn" onClick = {this.toggleSideBar}>
                                <i className = "glyphicon glyphicon-align-left"></i>
                                <span>Toggle Sidebar</span>
                            </button>
                        </div>

                        <div className = "collapse navbar-collapse" id = "bs-example-navbar-collapse-1">
                            <ul className = "nav navbar-nav navbar-right">
                                <li><Link to="/">Log Out</Link></li>

                            </ul>
                        </div>
                    </div>
                </nav>
                {this.state.openedView === "welcome" && (
                    <Welcome/>
                )}
                {this.state.openedView === "createvehicle" && (
                    <CreateVehicle email={this.state.email}/>
                )}
                {this.state.openedView === "viewvehicle" && (
                    <ViewVehicle email={this.state.email}/>
                )}
                {this.state.openedView === "checkfault" && (
                    <CheckFault email={this.state.email}/>
                )}
                
            </div>
        </div>

        );
    }
}

export default DashboardPage;