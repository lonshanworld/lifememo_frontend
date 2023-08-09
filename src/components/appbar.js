import React, {useEffect, useState} from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";


function Appbar(props){
    const navigate = useNavigate();

    function gotoprofile(){
        navigate(`/profile/${props.userId}/${props.userId}`);
    }

    function gotocreatepost(){
        navigate(`/createpost/${props.userId}`);
    }

    return (
        <div className={`absolute z-10 appbarshadow h-12 w-full bg-cuswood flex justify-evenly items-center flex-row rounded-b-lg`}>
          
            <div className="flex justify-center items-center flex-row">
                {props.imgurl ? (
                    <img className="h-10 px-3 py-1 backgroundClr" src={props.imgurl} alt="logo"/>    
                ) : (
                    <img className="h-10 px-3 py-1 backgroundClr" src={Logo} alt="logo"/>
                )}
                <span
                className="active:bg-gray-400 active:bg-opacity-60"
                onClick={gotoprofile}>
                    <span className="text-base text-white pl-2">{props.text}</span>
                </span>
            </div>
            <button 
            onClick={gotocreatepost}
            className="text-sm px-3 py-1 active:bg-cuswoodlight active:text-white text-white rounded-md hover:text-gray-300 flex justify-center items-center" >
                <span className="pr-1">Create post</span>
                <i className="fa-solid fa-circle-plus animate-spin"></i>
            </button>
        </div>
    );
}

export default Appbar;