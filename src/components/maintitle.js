import React from "react";
import butterfly from "../assets/butterfly.png";

function Maintitle(){
    return (
        <div className="relative">
            <div className="maintitle -rotate-12">
                <span className="px-5 py-2 rounded-lg">Life Memory</span>
            </div>
            <br/>
            <span className="infoapp block pt-3">Store your memories in this application</span>
            <img className="absolute w-8 h-8 rotate-12 top-0 left-10" src={butterfly} />
        </div>
    );
}

export default Maintitle;