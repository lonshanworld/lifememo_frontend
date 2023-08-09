import React, { useContext, useEffect,useState } from "react";
import { useTheme, useThemeUpdate } from "../customhooks/usethemehook";
import { useCookies } from "react-cookie";
import { UpdateShowErrorContext } from "../customhooks/errorhander";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import { getApiRequest } from "../utils/apiRequests";
import { useNavigate } from "react-router-dom";
import LeftBtns from "../components/btns/leftsidebtns";


function Leftmenu(props){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [classvalue, setClasevalue] = useState("fixed w-60 h-5/6 mt-14 -translate-x-64 z-20");
    const [themedropdown, setThemedropdown] = useState(false);
    const toggletheme = useThemeUpdate();
    const [cookies, setCookie, removeCookie] = useCookies(["jwtforlifememory"]);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const navigate = useNavigate();

    function handlesize(){
        setWindowWidth(window.innerWidth);
    }

    function switchtheme(){
        toggletheme();
    }

    async function logoutFunc(){
        // toggleShowError("passing value error");
        toggleShowloading(true);
        const respose = await getApiRequest(`${process.env.REACT_APP_BASE_API}logout`,cookies.jwtforlifememory);
        if(respose.status === 200){

            setTimeout(()=>{
                toggleShowloading(false);
                removeCookie("jwtforlifememory");
                navigate("/");
            },2000);
        }else{
            toggleShowloading(false);
            toggleShowError(true,respose.statusText);
        }
    }

    function gotoSearch(){
        navigate(`/search/${props.userInfo._id}`);
    }

    function gotoupdateScreen(){
        navigate(`/updateprofile/${props.userInfo._id}`);
    }

    useEffect(()=>{
        window.addEventListener("resize",handlesize);

        if(windowWidth < 1024){
            if(props.showvalue === true){
                setClasevalue("fixed top-0 left-0 w-60 h-5/6 mt-14 translate-x-0 z-20");
            }else{
                setClasevalue("fixed top-0 left-0 w-60 h-5/6 mt-14 -translate-x-64 z-20");
            }
        }else{
            setClasevalue("lg:col-span-1 lg:block h-5/6 w-4/5 mx-auto my-auto");
        }

        return () =>{
            window.removeEventListener("resize",handlesize);
        };
    },[windowWidth,props.showvalue]);

    return (
        <div className={`transition-all transform duration-500 ease-in-out ${classvalue}  backgroundClr leftsidepageshadow rounded-2xl overflow-y-scroll`}>
            <div className="w-full h-full">
                <p className="text-lg text-center h-12 py-2 border-b-2 border-green-500">Menu & Settings</p>
                <LeftBtns text="Find people" classListName="fa-solid fa-magnifying-glass-plus text-xl" func={gotoSearch} />
                <LeftBtns text="Update profile" classListName="fa-solid fa-retweet text-xl" func={gotoupdateScreen} />
                <div className="transition-all duration-300 ease-in-out text-center py-2 border-b border-gray-500 mx-5">
                    <button 
                        onClick={()=>setThemedropdown(!themedropdown)}
                        className="hover:text-lime-500 active:text-lime-500 w-full flex justify-center items-center">
                        <i className="fa-solid fa-palette text-xl px-2"></i>
                        <span className="text-sm">Change Theme</span>
                        <i className={`transition-all duration-300 ease-in-out fa-solid fa-caret-down text-xl px-2 ${themedropdown ? "" : "fa-rotate-90"}`}></i>
                    </button>
                    <div className={`flex justify-center items-center pt-3 pb-1 ${themedropdown ? "" : "hidden"}`}>
                        <span className="pr-2 text-xs">Dark mode</span>
                        <button onClick={switchtheme} className="transition-all duration-300 ease-in-out">
                            <div className={`w-10 h-5 transition-all transform duration-300 ease-in-out flex ${useTheme() ? "bg-green-500" : "bg-gray-300"} items-center rounded-full`}>
                                <div className={`ml-1 w-3.5 h-3.5 rounded-full bg-white  transition-all transform duration-300 ease-in-out ${useTheme() ? "translate-x-5" : ""}`}></div>
                            </div>
                        </button>
                    </div>
                </div>
                <LeftBtns text="Log out" classListName="fa-solid fa-right-from-bracket text-xl" func={logoutFunc} />
            </div>
        </div>
    );
}


export default Leftmenu;