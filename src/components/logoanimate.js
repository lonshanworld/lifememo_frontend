import React from "react";
import "../styles/animatebutterfly.css"
import butterfly from "../assets/butterfly.png";

function Logoanimate(){
    return (
        <>
            <img className="animatebutterfly" src={butterfly} />
            <img className="animatebutterfly2" src={butterfly} />
        </>
    );
}

export default Logoanimate;