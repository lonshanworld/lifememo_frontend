import React from "react";

function LeftBtns(props){
    return(
        <div className="text-center py-2 border-b border-gray-500 mx-5">
            <button
            onClick={props.func} 
            className="w-full flex justify-center items-center active:text-lime-500 hover:text-lime-500">
            <i className={`${props.classListName} pr-2`}></i>
        <span className="text-sm">{props.text}</span>
            </button>
        </div>
    );
}

export default LeftBtns;