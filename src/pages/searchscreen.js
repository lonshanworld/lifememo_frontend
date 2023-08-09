import React, { useRef, useContext, useState , useCallback} from "react";
import { useParams } from "react-router-dom";
import {getApiRequest} from "../utils/apiRequests";
import { UpdateShowErrorContext } from "../customhooks/errorhander";
import { useCookies } from "react-cookie";
import LikeBox from "../components/btns/tinybox/likebox";

function SearchScreen(){
    const {userId} = useParams();
    const [userlist, setUserlist] = useState(null);
    const [cookies] = useCookies(["jwtforlifememory"]);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const inputRef = useRef();

    async function getResult(e){
        e.preventDefault();
        
        if(inputRef.current.value !== ""){
            const response = await getApiRequest(
                `${process.env.REACT_APP_BASE_API}user/findpeople?nametext=${inputRef.current.value.toLowerCase()}`,
                cookies.jwtforlifememory,
            );
            if(response.status === 200){
                const rawdata =await response.json();
                setUserlist(rawdata);
            }else{
                toggleShowError("true", response.statusText);
            }
        }
    }

    const Userboxlist = useCallback(()=>{
        if(userlist !== null ){
            
            return <div 
            className="backgroundClr h-[calc(100vh-140px)] w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 rounded-lg py-3 shadow-sm shadow-green-500 mx-auto">
                {
                    userlist.map((e)=><LikeBox image={e.profileImg} name={e.userName} accountId={e._id} userId={userId} key={e._id} />)
                }
            </div>;
        }else{
            return <div 
            className="backgroundClr h-[calc(100vh-140px)] w-4/5 sm:w-3/5 md:w-1/2 lg:w-2/5 rounded-lg py-3 shadow-sm shadow-green-500 mx-auto flex justify-center items-start">
                <div>
                    <i className="fa-solid fa-xmark fa-xl mr-2"></i>
                    <span className="text-base">User not found</span>
                </div>
            </div>;
        }
    },[userlist]);

    return (
        <div className="w-screen h-screen">
            <form 
            onSubmit={getResult}
            className="mt-6 flex justify-center items-center">
                <div
                className="backgroundClr px-3 py-1 shadow-sm shadow-blue-400 rounded-md flex justify-between w-4/5 sm:w-4/6 md:w-3/5 lg:w-1/2">
                    <input
                    ref={inputRef}
                    className="outline-none bg-transparent text-sm w-full"
                    type="text" placeholder="Search people .... " />
                    <button
                    onClick={getResult}
                    className="px-1.5 py-1 rounded-md active:bg-gray-400 active:text-white">
                        <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                    </button>
                </div>
            </form>
            <div 
            className="mt-3 w-full">
                <p 
                className="mt-4 mb-2 text-center text-gray-500 underline underline-offset-4 decoration-4 decoration-gray-500 text-base">
                    Results
                </p>
                <Userboxlist/>
            </div>
        </div>
    );
}

export default SearchScreen;