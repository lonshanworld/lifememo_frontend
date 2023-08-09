import React from "react";
import { useTheme } from "../../customhooks/usethemehook";
import TextwithIcon from "../textwithicon";

function Postdetailbtns(props){
    const dark = useTheme();

    return (
        <button 
        onClick={()=>props.func(props.text)}
        className="w-full flex-col border-x border-gray-500 justify-center items-center active:bg-gray-400 active:bg-opacity-40">
            <TextwithIcon icon={props.classtxt(props.text)} text={props.text} />
            <span>{props.count(props.text)}</span> 
        </button>
    );
}

export default Postdetailbtns;