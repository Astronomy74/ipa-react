import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import FormProcess from "./formProcess";

function Proceed(props) {
    const storedData = localStorage.getItem('request');
    const parsedData = JSON.parse(storedData);
    console.log(parsedData);

    return(
        <div>
        <NavBar props={props}/>
        <main>
        {parsedData.internship ? (
            <FormProcess request={parsedData}/>
            ) : (
                <div></div>
            )}
        </main>
        </div>
    )
}

export default Proceed;