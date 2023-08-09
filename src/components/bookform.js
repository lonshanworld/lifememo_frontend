import React from "react";
import Logoanimate from "./logoanimate";
import bookImage from "../assets/book.png";
import leaves from "../assets/leaves.png";

function Bookform({children}){
    return (
        <div>
        <Logoanimate/>
            <div className="loginbook">
                <img className="" src={bookImage}/>
                <img className="absolute top-4 right-12 w-12 h-12" src={leaves} />
                {children}    
            </div>
        </div>
    );
}

export default Bookform;