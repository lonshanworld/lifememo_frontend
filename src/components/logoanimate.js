import React from "react";
import "../styles/animatebutterfly.css"
import butterfly from "../assets/butterfly.png";

function Logoanimate(){
    return (
        <>
            <img className="animatebutterfly" src={butterfly} alt="butterfly"/>
            <img className="animatebutterfly2" src={butterfly} alt="butterfly"/>
        </>
    );
}

export default Logoanimate;