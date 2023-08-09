import React from "react";

function ShowCallingbtn(props){
    return (
        <button
        onClick={props.func} 
        className="flex relative z-30 flex-col justify-center px-3 py-2 bg-green-300 text-black items-center active:text-blue-500 rounded-md">
            <span className="">{props.txt}</span>
            <div className="text-base flex justify-center items-center">
                <span>{props.btntxt}</span>
                <i className="fa-solid fa-check fa-lg pl-1"></i>
            </div>
        </button>
    );
}

export default ShowCallingbtn;