import React, { useRef } from "react";
import "../styles/loginandsignup.css";

import Maintitle from "../components/maintitle";
import CustomInput from "../components/textfield";
import { useNavigate } from "react-router-dom";
import Bookform from "../components/bookform";

import { useState } from "react";
import Errorbox from "../components/errorbox";
import Loadingbox from "../components/loadingbox";
import { useCookies } from "react-cookie";

function Login(){
    const [cookies,setCookie] = useCookies(["jwtforlifememory"]);
    const emailinputRef = useRef();
    const passwordinputRef = useRef();
    const navigate = useNavigate();
    const [showerror, setShowerror] = useState(false);
    const [errortext, setErrorText] = useState("");
    const [showloading, setShowloading] = useState(false);


    async function onSubmitFunc(e){
        e.preventDefault();
        if(emailinputRef.current.value.trim() && passwordinputRef.current.value.trim()){
            setShowloading(true);
            const formdata =new FormData();
            formdata.append("email", emailinputRef.current.value);
            formdata.append("password", passwordinputRef.current.value);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_API}login`,
                {
                    method: "POST",
                    // credentials: 'include' ,
                    body: formdata
                },
            );
            setShowloading(false);
            if(response.status === 200){
                const data = await response.json();
                // console.log(data["token"])
                setCookie('jwtforlifememory', data["token"]);
                navigate("/main");
            }else{
                // console.log(response.statusText);
                // let text = await response.json();
                // console.log(text);
                setErrorText(response.statusText);
            
                setShowerror(true);
            } 
        }else{
            setErrorText("Text input should not be empty");
            
            setShowerror(true);
        }
    }

    function showErrorBox(){
        // console.log("function react here");
        setShowerror(false);
    }

    function gotoSignuppage(){
        navigate("/signup");
    }

    return (
        <div className="w-full h-full flex justify-evenly items-center flex-col sm:flex-row">
            {
                showerror && <Errorbox title="Error in Login Form" text={errortext} showboxFunc={showErrorBox}/>
            }
            {
                showloading && <Loadingbox/>
            }
            <div className="flex justify-evenly items-center flex-col">
                <Maintitle/>
                <button onClick={gotoSignuppage} className="textoppositeClr mt-4 py-1 px-4 bg-cusgreen active:text-gray-500 rounded-md" >Go to Signup page</button>
            </div>
            <Bookform>
                <form onSubmit={onSubmitFunc} className="absolute top-0 w-full h-full flex justify-evenly items-center flex-col pt-20" action="" method="">
                    <CustomInput
                        inputref={emailinputRef}
                        inputtype="email"
                        inputid="email"
                        labeltext="Email"
                        isSignup={true}
                    />
                    <CustomInput
                        inputref={passwordinputRef}
                        inputtype="password"
                        inputid="password"
                        labeltext="Password"
                        isSignup={true}
                    />
                    <button type="submit" className="textoppositeClr bg-cuswood py-1 px-3 self-end mr-20 active:text-gray-400 rounded-md">Login</button>
                </form>
            </Bookform>
        </div>
        
    );
}

export default Login;