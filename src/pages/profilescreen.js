import React, { useCallback, useEffect, useState,useContext,useRef } from "react";
import { useParams } from "react-router-dom";
import Logo from "../assets/logo.png";
import TextwithIcon from "../components/textwithicon";
import { getApiRequest, postApiRequest } from "../utils/apiRequests";
import { useCookies } from "react-cookie";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import { UpdateShowErrorContext } from "../customhooks/errorhander";

import "../styles/animateimagespin.css";
import "../styles/animatenametitle.css"
import TablerowItem from "../components/profilecomponents/tablerowitems";
import PostListdesign from "../components/middlepostscreenparts/postlistdesign";

const btns = [
    "Photos",
    "Posts",
    "Shares",
    "Others",
];

// const abouttds = [
//     {
//         "icon" : "fa-map-location",
//         "txt" : "This is user Location",
//     },
//     {
//         "icon" : "fa-address-card",
//         "txt" : "This user cover the address",
//     },
//     {
//         "icon" : "fa-graduation-cap",
//         "txt" : "This is user Education",
//     },
//     {
//         "icon" : "fa-user-group",
//         "txt" : "This user has 77 friends",
//     },
//     {
//         "icon" : "fa-star",
//         "txt" : "This user likes gaming category",
//     },
// ];

function ProfileScreen(){
    const {userId} = useParams();
    const {accountId} = useParams();

    const [cookies] = useCookies(["jwtforlifememory"]);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const {toggleShowloading} = useContext(ShowLoadingContext);

    const [showInfo, setShowInfo] = useState(false);
    const [btntxt, setBtntxt] = useState();
    const [userInfo, setUserInfo] = useState();
    const [originaluserInfo, setOriginaluserInfo] = useState();
    const [stillnotfriend, setStillnotfriend] = useState(false);
    const [isblocked, setIsblocked] = useState(false);
    const memoRef = useRef();
    
    async function fetchUsersData(){
        toggleShowloading(true);
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user?userId=${accountId}`,cookies.jwtforlifememory);
        const originaluserresponse = await getApiRequest(`${process.env.REACT_APP_BASE_API}user?userId=${userId}`,cookies.jwtforlifememory)
        if(response.status === 200 && originaluserresponse.status === 200){
            const rawdata = await response.json();
            const originalrawdata = await originaluserresponse.json();
            toggleShowloading(false);
            // console.log(rawdata["message"]["userData"]);
            
            setUserInfo(rawdata["message"]["userData"]);
            setOriginaluserInfo(originalrawdata["message"]["userData"]);

        }else{
            toggleShowloading(false);
            toggleShowError(true, "Something went wrong");
        }
    }


    function btnsFunc(value){
        setBtntxt(value);
    }

    function showinfoFunc(){        
        setShowInfo(prev => !prev);
    }

    async function addFriendFunc(){
        toggleShowloading(true);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}user/addfriend?friendId=${accountId}`,
            cookies.jwtforlifememory,
            null,
            );
            toggleShowloading(false);    
        if(response.status === 200){
            setStillnotfriend(true);
        }else{
            toggleShowError(true, response.statusText)
        }
    }

    async function removeFriendFunc(){
        toggleShowloading(true);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}user/removefriend?friendId=${accountId}`,
            cookies.jwtforlifememory,
            null,
            );
            toggleShowloading(false);    
        if(response.status === 200){
            setIsblocked(true);
        }else{
            toggleShowError(true, response.statusText)
        }
    }

    async function submitPost(e){
        e.preventDefault();
        toggleShowloading(true);

        const formdata = new FormData();
        formdata.append("txt", memoRef.current.value);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}post/sendpost`,
            cookies.jwtforlifememory,
            formdata,
        );
        toggleShowloading(false);
        // console.log(response.status);
        if(response.status === 200){
            memoRef.current.value = "";
        }else{
            toggleShowError(true,response.statusText);
        }
    }

    const Showright = useCallback(()=>{
        if(userInfo === undefined){
            return null;
        }else{
            if(btntxt === btns[0]){
                return <p>This is photos section and we will add this new feature in new update.</p>
            }else if(btntxt === btns[1]){
                return <>
                    {
                        userInfo["posts"].map((e)=><PostListdesign postId={e} key={e} originaluserInfo={originaluserInfo} />)
                    }
                </>
            }else if(btntxt === btns[2]){
                return <>
                    {
                        userInfo["shareposts"].map((e)=><PostListdesign postId={e} key={e} originaluserInfo={originaluserInfo} />)
                    }
                </>
            }else{
                return <p>We will add this new feature in new update.</p>
            }
        }
    },[btntxt]);

    useEffect(()=>{
        fetchUsersData();
    
    },[]);

    return (
        <>
            {
                (userInfo !== undefined) && <div className="w-screen h-screen md:flex">
                    <div className="w-full md:h-screen md:w-1/2 lg:w-2/5 md:overflow-y-scroll">
                        <div className="px-5 py-5 w-full relative">
                            <div className="w-full aspect-[16/9] bg-cuswood rounded-md shadow-sm shadow-gray-500">
                            </div>
                            <div className="relative -translate-y-10 w-full">
                                <span 
                                className="pr-4 pl-24 py-2 font-bold absolute top-6 backgroundClr rounded-full z-0 h-8 max-w-full truncate shadow-sm shadow-gray-500 customanimatename">
                                    {userInfo["userName"]}
                                </span>
                                <img
                                className="rounded-full bg-cuswoodlight w-20 h-20 z-10 absolute shadow-sm shadow-gray-500 customImagespin" 
                                src={Logo} />
                            </div>
                        </div>
                        {
                            (accountId !== userId) && <div className="mt-8 mx-14 flex justify-evenly items-center">
                                {
                                    originaluserInfo["friends"].includes(accountId) 
                                        ?
                                        <div className="text-cusgreen text-base">
                                            <i className="fa-solid fa-check fa-xl pr-1"></i>
                                            <span>Friend</span>
                                        </div>
                                        :
                                        stillnotfriend
                                            ?
                                            <div className="text-cusgreen text-base">
                                                <i className="fa-solid fa-check fa-xl pr-1"></i>
                                                <span>Friend</span>
                                            </div>
                                            :
                                            <button onClick={addFriendFunc} className="cusbtnblue">
                                                <i className="fa-solid fa-user-plus fa-bounce fa-lg"></i>
                                                <span>Add Friend</span>
                                            </button> 
                                }
                                { isblocked
                                    ?
                                    <button onClick={addFriendFunc} className="cusbtnblue">
                                        <i className="fa-solid fa-user-plus fa-bounce fa-lg"></i>
                                        <span>Add Friend</span>
                                    </button> 
                                    :
                                    originaluserInfo["friends"].includes(accountId) && <button 
                                        onClick={removeFriendFunc}
                                        className="cusbtnred">
                                        <i className="fa-solid fa-user-slash fa-lg"></i>
                                        <span>Block</span>
                                    </button>
                                }
                            </div>
                        }
                        <div className="px-10 pt-6">
                            <div>
                                <button
                                onClick={showinfoFunc}
                                className={`px-6 py-3 ${showInfo ? "bg-lime-400 bg-opacity-30 rounded-sm" : "backgroundClr rounded-full"} shadow-sm shadow-gray-500 transition-all duration-300 ease-in-out`}>
                                    <TextwithIcon icon="fa-circle-info" text={`Click to ${showInfo ? "hide" : "show more"} information`} />
                                </button>
                            </div>
                            <table className={`mx-5 table-auto block ${showInfo ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"} transition-all transform origin-top duration-300 ease-in-out backgroundClr shadow-sm shadow-gray-500 rounded-tr-3xl rounded-bl-3xl p-3 mt-2`}>
                                <tbody>
                                    {/* {
                                        abouttds.map(e =><tr key={e.txt}>
                                            <td className="px-3 py-3">
                                                <i className={`fa-solid ${e.icon} fa-xl`}></i>
                                            </td>
                                            <td>{e.txt}</td>
                                        </tr>)
                                    } */}
                                    <TablerowItem txt="-" icon="fa-map-location" />
                                    <TablerowItem txt={userInfo["email"]} icon="fa-address-card" />
                                    <TablerowItem txt="-" icon="fa-graduation-cap" />
                                    <TablerowItem txt={`has ${userInfo["friends"].length} friends`} icon="fa-user-group" />
                                    <TablerowItem txt="likes Gaming category" icon="fa-star" />
                                </tbody>
                            </table>
                        </div>
                        {
                            (accountId === userId) && <div className={`${showInfo ? "translate-y-5" : "-translate-y-56"} transition-all duration-300 ease-in-out mb-5 mx-5 px-5`}>
                                <form
                                onSubmit={submitPost}
                                className="backgroundClr p-3 shadow-sm shadow-gray-500 rounded-md flex-col justify-center items-center">
                                    <textarea
                                    ref={memoRef}
                                    className="w-full h-16 bg-transparent outline-none" 
                                    type="text" placeholder="Create your memo"/>
                                    <button
                                    onClick={submitPost}
                                    className="flex justify-center items-center text-cuswood active:text-cuswoodlight">
                                        <i className="fa-solid fa-pen-to-square fa-lg pr-2"></i>
                                        <span>Create memo</span>
                                    </button>
                                </form>
                            </div>
                        }
                        {/* <div className={`backgroundClr flex justify-evenly items-center ${showInfo ? "translate-y-5" : "-translate-y-56"} transition-all duration-300 ease-in-out mx-5 mb-10 shadow-sm shadow-gray-500 py-3 rounded-md`}>
                            {
                                btns.map(e =><button key={e}
                                onClick={()=>btnsFunc(e)} 
                                className={`active:text-cusblue ${e === btntxt ? "text-cusblue underline underline-offset-4 decoration-2" : "text-gray-400"}`}>
                                    {e}
                                </button>)
                            }
                        </div> */}
                    </div>
                    <div className={`w-full md:h-screen md:w-1/2 lg:w-3/5 ${showInfo ? "translate-y-5 md:translate-y-0" : "-translate-y-56 md:translate-y-0"} flex-col justify-center items-center px-5`}>
                        <div className={`backgroundClr my-5 flex justify-evenly items-center transition-all duration-300 ease-in-out mx-5 shadow-sm shadow-gray-500 py-3 rounded-md`}>
                            {
                                btns.map(e =><button key={e}
                                onClick={()=>btnsFunc(e)} 
                                className={`active:text-cusblue ${e === btntxt ? "text-cusblue underline underline-offset-4 decoration-2" : "text-gray-400"}`}>
                                    {e}
                                </button>)
                            }
                        </div>
                        <div
                        className="md:h-[calc(100vh-100px)] md:overflow-y-scroll w-full md:w-11/12 mx-auto">
                            <Showright/>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default ProfileScreen;
