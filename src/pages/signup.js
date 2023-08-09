import React, { useRef,useState } from "react";
import Maintitle from "../components/maintitle";
import Bookform from "../components/bookform";
import "../styles/loginandsignup.css";
import CustomInput from "../components/textfield";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Errorbox from "../components/errorbox";
import Loadingbox from "../components/loadingbox";

function Signup(){
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const birthDateRef = useRef();
    const navigate = useNavigate();
    const [showerror, setShowerror] = useState(false);
    const [errortext, setErrorText] = useState("");
    const [showloading, setShowloading] = useState(false);
    const [cookies,setCookie] = useCookies(["jwtforlifememory"]);

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yr = today.getFullYear();

    let todaytext = yr+"-"+mm+"-"+dd;

    async function signupFunc(e){
        e.preventDefault();
        if(userNameRef.current.value.trim() && emailRef.current.value.trim() && passwordRef.current.value.trim() && confirmPasswordRef.current.value.trim() && birthDateRef.current.value){
            
            if(passwordRef.current.value === confirmPasswordRef.current.value){
                setShowloading(true);
                const formdata = new FormData();
                formdata.append("userName", userNameRef.current.value);
                formdata.append("email", emailRef.current.value);
                formdata.append("password", passwordRef.current.value);
                formdata.append("birthDate",birthDateRef.current.value);

                const response = await fetch(
                    `${process.env.REACT_APP_BASE_API}signup`,
                    {
                        method: "POST",
                        // credentials: 'include' ,
                        body: formdata,
                    },
                );
                setShowloading(false);
                if(response.status === 200){
                    const data = await response.json();
                    // console.log(data["token"])
                    setCookie('jwtforlifememory', data["token"]);
                    navigate("/main");
                }else{
                    setErrorText(response.statusText);
                    setShowerror(true);
                }
            }else{
                setErrorText("Password and confirm password are not same");
                setShowerror(true);
            }
        }else{
            setErrorText("Text input should not be enpty");
            setShowerror(true);
        }
    }

    function showErrorBox(){
        // console.log("function react here");
        setShowerror(false);
    }

    function gotoLoginpage(){
        navigate("/login");
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
                <button onClick={gotoLoginpage} className="textoppositeClr mt-4 py-1 px-4 block bg-cusgreen active:text-gray-500 rounded-md" >Go to Login page</button>
            </div>
            <Bookform>
                <form onSubmit={signupFunc} className="absolute top-0 w-full h-full flex justify-evenly items-center flex-col pt-10 pb-3" >
                    <CustomInput
                        inputref={userNameRef}
                        inputtype="text"
                        inputid="username"
                        labeltext="Username"
                        isSignup={true}
                    />
                    <CustomInput
                        inputref={emailRef}
                        inputtype="email"
                        inputid="email"
                        labeltext="Email"
                        isSignup={true}
                    />
                    <CustomInput
                        inputref={passwordRef}
                        inputtype="password"
                        inputid="password"
                        labeltext="Password"
                        isSignup={true}
                    />
                    <CustomInput
                        inputref={confirmPasswordRef}
                        inputtype="password"
                        inputid="confirmpassword"
                        labeltext="Confirmpassword"
                        isSignup={true}
                    />
                    <div className="ml-12">
                        <label className="text-cuswood mr-3">Birthdate</label>
                        <input ref={birthDateRef} type="date" className="bg-transparent text-cuswood" max={todaytext} required/>
                    </div>
                    <button 
                    type="submit" 
                    onClick={signupFunc}
                    className="text-white bg-cuswood py-1 px-3 mr-20 active:text-gray-400 self-end rounded-md">Sign up</button>
                </form>
            </Bookform>
        </div>
    );
}

export default Signup;