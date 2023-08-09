import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {getApiRequest} from "../utils/apiRequests";

function CookieChecker({children}){
    const [cookies,setCookie, removeCookie] = useCookies(["jwtforlifememory"]);
    const navigate = useNavigate();

    useEffect(()=>{
        // console.log('This is inside useeffect of cookiechecker');
        if(!cookies.jwtforlifememory){
            navigate("/");
        }else{
            async function fetchdata(){
                const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user/profile`,cookies.jwtforlifememory);
                if(response.status === 200){
                    return ;
                }else{
                    removeCookie("jwtforlifememory");
                    navigate("/");
                }
            }
            fetchdata();
        }
    },[cookies]);

    return (
        <>
            {children}
        </>
    );
}

export default CookieChecker;