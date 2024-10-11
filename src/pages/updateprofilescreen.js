import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import CustomInput from "../components/textfield";
import { UpdateShowErrorContext } from "../customhooks/errorhander";
import { UpdateShowAlertContext } from "../customhooks/showalertbox";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import { getApiRequest, postApiRequest } from "../utils/apiRequests";
import DatePicker, { setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UpdateProfileScreen(){
    const {userId} = useParams();
    const [cookies] = useCookies(["jwtfornotememo"]);

    const usernameRef = useRef();
    const emailRef = useRef();
    const newpasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const oldpasswordRef = useRef();
    // const birthDateRef = useRef();
    const imageRef = useRef();
    const [selectdate,setSelectDate] = useState(null);
    // const [oldbirtdate, setOldbirthdate] = useState("")

    const [showimage, setShowimage] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const {toggleAlertBox} = useContext(UpdateShowAlertContext);

    const navigate = useNavigate();

    // let today = new Date();
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1;
    // let yr = today.getFullYear();

    // let todaytext = yr+"-"+mm+"-"+dd;

    async function getPersonalData(){
        toggleShowloading(true);
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user/profile`,cookies.jwtfornotememo);
        toggleShowloading(false);
        if(response.status === 200){
            const data = await response.json();
            setUserInfo(data["message"]["userdata"]);
            
            usernameRef.current.value = data["message"]["userdata"].userName;
            emailRef.current.value = data["message"]["userdata"].email;
            // setSelectDate(data["message"]["userdata"].birthDate.split("T")[0]);
            
            // birthDateRef.current.value = data["message"]["userdata"].birthDate.split("T")[0];
            // console.log(data["message"]["userdata"].birthDate.split("T")[0]);
            // setOldbirthdate(data["message"]["userdata"].birthDate.split("T")[0]);
        }else{
            toggleShowError(true, response.statusText);
        }
        
    }

    function updateprofileFunc(e){
        e.preventDefault();
        console.log(selectdate);
        if(oldpasswordRef.current.value === ""){
            toggleAlertBox(true, "You must fill old-password field to update profile");
        }else{
            let formdata = new FormData();
            formdata.append("userName", usernameRef.current.value);
            formdata.append("email", emailRef.current.value);
            formdata.append("oldpassword", oldpasswordRef.current.value);
            if(selectdate === null){
                formdata.append("birthDate", userInfo.birthDate.split("T")[0]);
            }else{
                const year = selectdate.toLocaleString("default", { year: "numeric" });
                const month = selectdate.toLocaleString("default", { month: "2-digit" });
                const day = selectdate.toLocaleString("default", { day: "2-digit" });
                const formattedDate = year + "-" + month + "-" + day;
                formdata.append("birthDate", formattedDate);
            }
            
            var file = imageRef.current.files;
            if(file.length > 0){
                formdata.append("files",imageRef.current.files[0]);
            }
            // console.log(newpasswordRef.current.value);
            if(newpasswordRef.current.value !== ""){
                if(newpasswordRef.current.value !== confirmPasswordRef.current.value){
                    toggleAlertBox(true, "New password must be same with comfirm-new-password");
                }else{
                    formdata.append("newpassword", newpasswordRef.current.value);
                    uploaddata(formdata);
                }
            }else{
                formdata.append("newpassword", oldpasswordRef.current.value);
                uploaddata(formdata);
            }
        }
    }

    async function uploaddata(formdata){
        toggleShowloading(true);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}user/updateprofile`,
            cookies.jwtfornotememo,
            formdata,
        );
        toggleShowloading(false);
        if(response.status === 200){
            navigate("/main");
        }else{
            toggleShowError(true, response.statusText);
        }
    }

    function previewimage(){
        var file = imageRef.current.files;
        if(file.length > 0){
            var filereader = new FileReader();
            filereader.onload = function (event){
                document.getElementById("imgpreview").setAttribute("src", event.target.result);
            };
            setShowimage(true);
            filereader.readAsDataURL(file[0]);
        }
    }

    function removeimage(e){
        e.preventDefault();
        document.getElementById("imgpreview").setAttribute("src", "");
        imageRef.current.value = "";
        setShowimage(false);
    }

    useEffect(()=>{
        getPersonalData();
    },[])

    return (
        <div 
        className="flex-col justify-center items-center w-screen h-screen overflow-y-scroll">
            <p
            className="text-center my-3 text-base underline underline-offset-4 decoration-4">
                Update Profile
            </p>
            <div className="w-5/6 sm:w-4/6 md:w-3/6 h-full py-3 flex justify-around items-center mx-auto ">
                <form onSubmit={updateprofileFunc} 
                className="relative top-0 w-full h-full flex-col flex justify-evenly items-center mr-20 self-center" >
                    <CustomInput
                        inputref={usernameRef}
                        inputtype="text"
                        inputid="username"
                        labeltext="Username"
                        isSignup={false}
                    />
                    <CustomInput
                        inputref={emailRef}
                        inputtype="email"
                        inputid="email"
                        labeltext="Email"
                        isSignup={false}
                    />
                    <CustomInput
                        inputref={oldpasswordRef}
                        inputtype="password"
                        inputid="oldpassword"
                        labeltext="Old-password"
                        isSignup={false}
                    />
                    <CustomInput
                        inputref={newpasswordRef}
                        inputtype="password"
                        inputid="password"
                        labeltext="New-password"
                        isSignup={false}
                    />
                    <CustomInput
                        inputref={confirmPasswordRef}
                        inputtype="password"
                        inputid="confirmpassword"
                        labeltext="Confirm-new-password"
                        isSignup={false}
                    />
                    {/* <div className="flex-col flex justify-center items-center">
                        <span>Old Birthdate : : {oldbirtdate}</span>
                        <div className="">
                            <label className="text-gray-400 mr-3">New Birthdate</label>
                            <input ref={birthDateRef} type="date" className="bg-transparent text-cuswood outline-none" max={todaytext} required/>
                        </div>
                    </div> */}
                    <div className="flex-col flex justify-center items-center">
                        <label className="text-gray-400 mr-3">Old birthDate : {userInfo === null ? "" : userInfo.birthDate.split("T")[0]}</label>
                        <DatePicker 
                            required
                            className="bg-cuswood text-white pl-1 rounded-md w-full placeholder-white" 
                            placeholderText="Tap to change Birth-date"
                            selected={selectdate}
                            onChange={(date) => setSelectDate(date)}
                        />
                    </div>
                    <div>
                        <label 
                        className="block mb-2 text-sm font-medium text-orange-700" htmlFor="file_input">Update profile</label>
                        <input 
                        ref={imageRef}
                        onChange={previewimage}
                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-gray-500 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none" 
                        id="file_input" type="file" />
                        {/* accept="image/*" */}
                    </div>
                    {
                        showimage && <div className="relative">
                            <img
                            className="w-full h-full rounded-md" 
                            id="imgpreview"/>
                            <button
                            onClick={removeimage}
                            className="absolute top-0 right-0 mr-3 mt-3 px-2 py-1 bg-red-500 rounded-md text-white active:bg-opacity-80">
                                Clear image
                            </button>
                        </div>
                    }
                    <button 
                    onClick={updateprofileFunc}
                    type="submit" 
                    className="bg-cuswood py-1 px-3 mr-20 active:text-gray-400 self-end rounded-md text-white">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfileScreen;