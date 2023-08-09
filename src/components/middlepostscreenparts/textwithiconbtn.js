import React, { useEffect, useState } from "react";
import { useTheme } from "../../customhooks/usethemehook";

function TextwithIconBtn(props){
    const dark = useTheme();

    return (
        <button
        onClick={props.btnfunc} 
        className={`${props.show ? dark ? "text-cuswoodlight" : "text-cuswood" : "text-gray-400"} flex justify-center items-center`}>
            <i className={`fa-solid ${props.iconClass} fa-xl pr-1`}></i>
            <span className="text-xs">{props.txt}</span>
        </button>
    );
}

export default TextwithIconBtn;