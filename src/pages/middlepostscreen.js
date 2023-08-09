import React, { useEffect,useContext,useState } from "react";
import { useCookies } from "react-cookie";
import PostListdesign from "../components/middlepostscreenparts/postlistdesign";
import {UpdateShowErrorContext} from "../customhooks/errorhander";
import { getApiRequest } from "../utils/apiRequests";


function Middlepostscreen(props){
    const [postIdlist, setPostIdlist] = useState([]);
    const [cookies] = useCookies(["jwtforlifememory"]);
    const [loading, setLoading] = useState(false);
    const {toggleShowError} = useContext(UpdateShowErrorContext);

    async function getpostdata(amountvalue){
        setLoading(true);
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}post?startnum=${postIdlist.length}&amount=${amountvalue}`, cookies.jwtforlifememory);
        if(response.status === 200){
            const data = await response.json();
            let allpostList = [];
            for(let a = 0; a < data.message.allposts.length; a++){
                allpostList.push(data.message.allposts[a]._id);
            }
  
            setPostIdlist([...postIdlist, ...allpostList]);
        }else{
            toggleShowError(true,response.statusText);
        }

        setLoading(false);
    }



    useEffect(()=>{
        getpostdata(3);
    },[]);

    return (
        <div className="w-full py-10 h-screen overflow-scroll">
            {
                postIdlist.map(singlepost => <PostListdesign postId={singlepost} key={singlepost} originaluserInfo={props.originaluserInfo} />)
            }
            <div className="flex justify-center items-center">
                <button 
                onClick={()=>{
                    // console.log("see more function");
                    getpostdata(3);
                }}
                className="flex justify-center items-center hover:text-gray-600 active:text-gray-600">
                    <span className="text-base pr-1 animate-bounce">See more</span>
                    {
                        loading ?
                        <i className="fa-solid fa-rotate-right fa-spin fa-lg"></i>
                            :
                        <i className="fa-solid fa-angles-right fa-rotate-90 fa-lg"></i>
                    }
                </button>
            </div>
        </div>
    );
}

export default Middlepostscreen;