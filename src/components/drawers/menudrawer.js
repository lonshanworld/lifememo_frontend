import React, {useEffect, useRef, useState} from "react";

function Menudrawer(props){
    const iconref = useRef();
    const btnref = useRef();

    function menuOnclick(){
      
        if(!props.showvalue){
            iconref.current.classList.add("rotate-180");
            btnref.current.classList.add("translate-x-52");
        }else{
            iconref.current.classList.remove("rotate-180");
            btnref.current.classList.remove("translate-x-52");
        }
        props.showFunc();
    }

    useEffect(()=>{
        if(props.showvalue){
            iconref.current.classList.add("rotate-180");
            btnref.current.classList.add("translate-x-52");
        }else{
            iconref.current.classList.remove("rotate-180");
            btnref.current.classList.remove("translate-x-52");
        }
    },[props.showvalue]);


    return (
        <button 
            ref={btnref}
            onClick={menuOnclick}
            className="btnshadow fixed bg-lime-200 px-3 py-2.5 top-11 left-3 z-30 block transition-all transform duration-500 ease-in-out rounded-full lg:hidden">
            <i ref={iconref} className='fa-solid fa-bars fa-xl text-cusgreen transition-all duration-500 ease-in-out'></i>
        </button>
    );
}


export default Menudrawer;