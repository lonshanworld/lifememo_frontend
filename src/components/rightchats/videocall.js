import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

function VideoCall(props){
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

        const getchatdimension = document.getElementById("videodiv");
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
        // onTouchMove={handleDrag}
        bounds={{top: 0 , left:  ((dimenison["width"]/2) * -1) , right: 0, bottom:  ((dimenison["height"]/2) - (chatdimension["chatheight"]/2))}}>
            <div
            id="videodiv"
           
            // onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            className="z-30 absolute top-0 right-0 w-56 h-72 border border-cuswood mt-24 mb-14 rounded-2xl">
                <video
                    ref={props.myvideo}
                    autoPlay
                    muted
                    className="absolute top-0 left-0 w-24 h-28 z-10 rounded-2xl object-cover scale-x-[-1]">
                </video>
                <video
                    ref={props.othervideo}
                    autoPlay
                    
                    className="z-0 w-full h-full rounded-2xl absolute object-cover scale-x-[-1]">
                </video>     
                <div className="w-full h-10 bg-gray-500 bg-opacity-60 absolute bottom-0 z-10 rounded-b-2xl flex justify-center items-center px-3">
                    <button
                    onClick={props.getvideoFunc} 
                    className="flex justify-center items-center active:text-blue-500">
                        <span>End call</span>
                        <i className="fa-solid fa-phone-slash fa-lg"></i>
                    </button>
                    
                    {/* <button className="flex justify-center items-center">
                        <span>Mute call</span>
                        <i class="fa-solid fa-microphone-slash fa-lg"></i>
                    </button> */}
                </div>
            </div>
        </Draggable>
    );
}

export default VideoCall;