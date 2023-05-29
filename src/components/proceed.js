import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import FormProcess from "./formProcess";
import LetterProcess from "./letterProcess";

function Proceed(props) {
    const storedData = localStorage.getItem('request');
    const parsedData = JSON.parse(storedData);

    return(
        <div>
        <NavBar props={props}/>
        <main>
        {parsedData.internship ? (
            <FormProcess request={parsedData}/>
            ) : (
            <LetterProcess request={parsedData}/>
            )}
        </main>
        </div>
    )
}

export default Proceed;