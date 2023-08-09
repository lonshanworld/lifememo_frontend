import React from "react";
import { useTheme } from "../customhooks/usethemehook";

function TextwithIcon(props){
    const dark = useTheme();

    return (
        <div
        className={`${true ? dark ? "text-cuswoodlight" : "text-cuswood" : "text-gray-400"} flex justify-center items-center text-start`}>
            <i className={`fa-solid ${props.icon} fa-xl pr-1`}></i>
            <span>{props.text}</span>
        </div>
    );
}

export default TextwithIcon;