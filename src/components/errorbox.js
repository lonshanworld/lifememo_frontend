import React from "react";

function Errorbox(props){

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="w-3/4 sm:w-2/4 md:w-2/6 px-5 py-5 flex justify-evenly items-center flex-col bg-white border-2 border-red-500 rounded-md">
                <span className="text-base text-red-500">{props.title}</span>
                <span className="self-start py-3">{props.title} - {props.text}</span>
                <button onClick={props.showboxFunc} className="rounded-md px-3 py-1 bg-cusblue text-white active:text-gray-400">Click to go back</button>
            </div>
        </div>
    );
}

export default Errorbox;