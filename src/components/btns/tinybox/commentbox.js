import React, { useEffect } from "react";
import Logo from "../../../assets/logo.png";
import NametoprofileBtn from "../nametoprofilebtn";
import convertTime from "../../../utils/convertTimeformat";

function CommentBox(props){


    return (
        <div className="border-b border-gray-400">
            <div className="w-full flex justify-start items-start px-5 py-1">
                <img src={props.data.image === null ? Logo : props.data.image} className="w-10 h-10 rounded-full"/>
                <div className="pl-2">
                    <div className="flex flex-col justify-center items-start">
                        <NametoprofileBtn name={props.data.name} accountId={props.data.id} userId={props.userId} />
                        <span className="text-xs text-gray-500">{convertTime(props.data.createDate)}</span>
                    </div>
                    <p className="mt-2 max-w-max break-words w-full">{props.data.message}</p>
                </div>
            </div>
        </div>
    );
}

export default CommentBox;