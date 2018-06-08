"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React from 'react';
import iconCheck from'../img/check.png';
const CheckItem = (props) => {
    return (
        <div>
            <div className="checkItem">
                <img src = {iconCheck} alt = {iconCheck}/>
                <p>{props.label}</p>
            </div>
            <hr/>
        </div>
        
    );
}

export default CheckItem;