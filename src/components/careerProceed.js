import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import SgkProcess from "./sgkProcess";

function CareerProceed(props) {
    const storedData = localStorage.getItem('request');
    const parsedData = JSON.parse(storedData);
    console.log(props);

    return(
        <div>
        <NavBar props={props}/>
        <main>
        {parsedData.internship ? (
            <SgkProcess request={parsedData}/>
            ) : (
                <div></div>
            )}
        </main>
        </div>
    )
}

export default CareerProceed;