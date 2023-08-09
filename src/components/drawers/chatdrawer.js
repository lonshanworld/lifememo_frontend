import React, {useEffect, useRef} from "react";

function Chatdrawer(props){
    const iconref = useRef();
    const btnref = useRef();

    function chatOnclick(){
        // console.log(btnref.current.classList);
        if(!props.showvalue){
            
            iconref.current.classList.add("fa-beat-fade");
            btnref.current.classList.add("-translate-x-52");
        }else{
            iconref.current.classList.remove("fa-beat-fade");
            btnref.current.classList.remove("-translate-x-52");
        }
        props.showFunc();
    }

    useEffect(()=>{
        if(props.showvalue){
            iconref.current.classList.add("fa-beat-fade");
            btnref.current.classList.add("-translate-x-52");
        }else{
            iconref.current.classList.remove("fa-beat-fade");
            btnref.current.classList.remove("-translate-x-52");
        }
    },[props.showvalue]);

    return (
        <button 
            ref={btnref}
            onClick={chatOnclick}
            className="btnshadow fixed bg-blue-200 px-3 py-2.5 top-11 right-3 z-30 block transition-all transform duration-500 ease-in-out rounded-full sm:hidden">
            <i ref={iconref} className='text-cusblue fa-solid fa-comment-dots fa-2xl'></i>
        </button>
    );
}


export default Chatdrawer;