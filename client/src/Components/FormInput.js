"use strict";

/*
    Created by Elvin on 07-05-2018
    ==============================
*/

import React from 'react';

const FormInput = (props) => {
    return (
        <div className="InputFieldHolder">        
            <label htmlFor={props.inputId}>{props.label}</label>
            <input id={props.inputId} type={props.type} placeholder={props.label} disabled={props.disabled} value={props.value}/>
        </div>
    );
}

export default FormInput;