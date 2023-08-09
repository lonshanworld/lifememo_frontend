import React from "react";
import Appbar from "../appbar";
import Middlepostscreen from "../../pages/middlepostscreen";

function Middlepartpost(props){
    return (
        <>
            <Appbar text={props.text} imgurl={props.imgurl} userId={props.originaluserInfo._id} />
            <Middlepostscreen originaluserInfo={props.originaluserInfo} />
        </>  
    );
}

export default Middlepartpost;