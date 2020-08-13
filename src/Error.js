import React, { Component } from 'react';
import './App.scss';

const Error = ( props ) => {

    return(
        <div className="popupBack">
            <div className="popup">
                <p>{props.error}</p>
                <button onClick={props.closeWindow} >{props.closeWindowText}</button>
            </div>
        </div>
    )
}

export default Error;