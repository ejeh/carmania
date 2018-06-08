"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React, {Component} from 'react';
import Header from '../Components/Header';
import Body from '../Components/BodyContent';

class LandingPage extends Component {

    render() {
        return (
            <div>
                <Header/>
                <Body/>
            </div>
            
        );
    }
}

export default LandingPage;