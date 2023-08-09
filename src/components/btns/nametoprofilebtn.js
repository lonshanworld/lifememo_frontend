import React from "react";
import { useNavigate } from "react-router-dom";

function NametoprofileBtn(props){
    const navigate = useNavigate();

    function gotoprofile(){
        navigate(`/profile/${props.accountId}/${props.userId}`);
    }

    return (
        <span
        className="active:bg-gray-400 active:bg-opacity-60"
        onClick={gotoprofile}>
            <span className="text-sm">{props.name}</span>
        </span>
    );
}

export default NametoprofileBtn;