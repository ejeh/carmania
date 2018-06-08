"use strict"

/*
    Created by Elvin on 07-05-2018
    ==============================
*/


import React, { Component } from 'react';
import LandingPage from './Views/LandingPage';
import UpdatePage from './Views/UpdatePage';
import DashboardPage from './Views/DashboardPage';
import { Route, Switch } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div >
        <Switch>
          <Route exact = {true} path="/" component = {LandingPage}/>
          <Route path = "/update/:email" component = {UpdatePage}/>
          <Route path = "/dashboard/:email" component = {DashboardPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
