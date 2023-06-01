import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import FormProcess from "./formProcess";
import LetterProcess from "./letterProcess";

function Proceed(props) {
    
    const storedData = localStorage.getItem('request');
    const parsedData = JSON.parse(storedData);
    console.log(parsedData)
    const userInfo = props.userInfo;

    return(
        <div>
        <NavBar props={props}/>
        <main>
        {parsedData.internship ? (
            <FormProcess request={parsedData} userInfo={userInfo}/>
            ) : (
            <LetterProcess request={parsedData} userInfo={userInfo}/>
            )}
        </main>
        </div>
    )
}

export default Proceed;