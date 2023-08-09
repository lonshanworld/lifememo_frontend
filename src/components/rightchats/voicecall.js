import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

function VoiceCall(props){
    const [position, setPosition] = useState({
        x : 0,
        y : 0,
    });
    const [dimenison, setDimension] = useState({
        width : 0,
        height : 0,
    });
    const [chatdimension, setChatdimension] = useState({
        chatwidth : 0,
        chatheight : 0,
    });

    function getDimension(){
        const checkdimension = document.getElementById("chatdimension");
        setDimension({
            width : checkdimension.offsetWidth,
            height : checkdimension.offsetHeight,
        });

        const getchatdimension = document.getElementById("calldiv");
        setChatdimension({
            chatwidth : getchatdimension.offsetWidth,
            chatheight : getchatdimension.offsetHeight,
        });
    }

    function handleDrag(e,ui){
        const {x, y} = position;
        setPosition({
            x : x+ ui.deltaX,
            y : y + ui.deltaY,
        });
    }

    useEffect(()=>{
        getDimension();
    },[])

    return (
        <Draggable
        onDrag={handleDrag}
        bounds={{top: 0 , left:  ((dimenison["width"]/2) * -1) , right: 0, bottom:  ((dimenison["height"]/2) - (chatdimension["chatheight"]/2))}}>
            <div
            id="calldiv"
            className="z-30 absolute top-0 right-0 w-40 h-16 border bg-green-400 border-cuswood mt-24 mb-14 rounded-2xl flex justify-center items-center">
                <audio
                ref={props.myaudio}
                muted
                className="">
                    Your audio sound
                </audio>
                <audio
                ref={props.otheraudio}
                autoPlay>
                    Your friend audio sound
                </audio>
                <button
                onClick={props.endcallFunc} 
                className="flex justify-center items-center active:text-blue-500">
                    <span>End voice chat</span>
                    <i className="fa-solid fa-phone-slash fa-lg"></i>
                </button>
            </div>
        </Draggable>
    );
}

export default VoiceCall;