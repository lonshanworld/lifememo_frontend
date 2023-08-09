import React from "react";
import Logo from "../../../assets/logo.png";
import NametoprofileBtn from "../nametoprofilebtn";

function LikeBox(props){
    return (
        <div className="w-full flex justify-start items-center px-5 py-1">
            <img src={props.image === null ? Logo : props.image} 
            className="w-10 h-10 rounded-full mr-2"/>
            <NametoprofileBtn name={props.name} accountId={props.accountId} userId={props.userId} />
        </div>
    );
}

export default LikeBox;