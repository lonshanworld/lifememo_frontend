import React, { useRef,useState } from "react";
import Maintitle from "../components/maintitle";
import Bookform from "../components/bookform";
import "../styles/loginandsignup.css";
import CustomInput from "../components/textfield";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Errorbox from "../components/errorbox";
import Loadingbox from "../components/loadingbox";
import DatePicker, { setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Signup(){
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [selectdate,setSelectDate] = useState(null);
    // const birthDateRef = useRef();
    const navigate = useNavigate();
    const [showerror, setShowerror] = useState(false);
    const [errortext, setErrorText] = useState("");
    const [showloading, setShowloading] = useState(false);
    const [cookies,setCookie] = useCookies(["jwtfornotememo"]);

    // let today = new Date();
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1;
    // let yr = today.getFullYear();

    // let todaytext = yr+"-"+mm+"-"+dd;

    async function signupFunc(e){
        e.preventDefault();
       
        if(userNameRef.current.value.trim() && emailRef.current.value.trim() && passwordRef.current.value.trim() && confirmPasswordRef.current.value.trim() && selectdate){
            const year = selectdate.toLocaleString("default", { year: "numeric" });
            const month = selectdate.toLocaleString("default", { month: "2-digit" });
            const day = selectdate.toLocaleString("default", { day: "2-digit" });
            const formattedDate = year + "-" + month + "-" + day;
            // console.log(formattedDate);
            if(passwordRef.current.value === confirmPasswordRef.current.value){
                setShowloading(true);
                const formdata = new FormData();
                formdata.append("userName", userNameRef.current.value);
                formdata.append("email", emailRef.current.value);
                formdata.append("password", passwordRef.current.value);
                formdata.append("birthDate",formattedDate);

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
                    setCookie('jwtfornotememo', data["token"]);
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
            setErrorText("All fields should be filled");
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
            {/* <div className="flex justify-evenly items-center flex-col">
                <Maintitle/>
                <div className="flex justify-center items-center">
                    <span className="text-lg mr-3">No account ?? </span>
                    <button onClick={gotoLoginpage} className="textoppositeClr mt-4 py-1 px-4 bg-cusgreen active:text-gray-500 rounded-md" >Go to Login page</button>
                </div>
            </div> */}
            <div className="flex justify-evenly items-center flex-col">
                <Maintitle/>
                <div>
                    <span className="text-lg mr-3">Have account ?? </span>
                    <button onClick={gotoLoginpage} className="textoppositeClr mt-4 py-1 px-4 bg-cusgreen active:text-gray-500 rounded-md" >Go to Login page</button>
                </div>
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
                        {/* <label className="text-cuswood mr-3">Birthdate</label> */}
                        {/* <input ref={birthDateRef} type="date" className="bg-transparent text-cuswood" max={todaytext} required/> */}
                        {/* <span className="text-cuswood mr-3">Change Birth-date</span>  */}
                        <DatePicker 
                            // ref={birthDateRef}
                            required
                            className="bg-cuswood text-white pl-1 rounded-md w-5/6 placeholder-white" 
                            placeholderText="Tap to pick Birth-date"
                            selected={selectdate}
                            onChange={(date) => setSelectDate(date)}
                        />
                        {/* <span>{selectdate}</span> */}
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