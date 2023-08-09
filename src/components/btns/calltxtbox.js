import React from "react";

function CalltxtBox(props){
    return (
        <span 
        className="px-3 z-30 relative py-1 ml-3 mt-3 bg-blue-300 rounded-md">
            {props.txt}
        </span>
    );
}

export default CalltxtBox;