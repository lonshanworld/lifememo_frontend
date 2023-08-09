import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";

function Chatmessage(props){
    const [items, setItems] = useState([]);

    useEffect(()=>{

        setItems(props.allchat);
    },[props.allchat]);

    return (
        <>
            {items.map((chat)=><div 
            key={items.indexOf(chat)}
            className={`z-0 flex my-2 w-auto items-center flex-row ${props.currentuserId !== chat.userId ? "justify-start ml-3" : "justify-end mr-3"}`}>
                {props.currentuserId !== chat.userId && <img src={props.friendImg === "" ? Logo : props.friendImg } className="h-7 w-7 rounded-full"/>}
                <p 
                className={`mx-3 max-w-max break-words w-4/6 bg-opacity-40 p-2 rounded-md ${props.currentuserId !== chat.userId ? "text-left bg-gray-500" : "text-left bg-cusbluelight"}`}
                >{chat.text}</p>
                {props.currentuserId === chat.userId && <img src={props.selfImg === "" ? Logo : props.selfImg} className="h-7 w-7 rounded-full"/>}
            </div>)}
        </>
    );
}

export default Chatmessage;