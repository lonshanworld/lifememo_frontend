import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png"
import { useTheme } from "../../customhooks/usethemehook";
import { getApiRequest, postApiRequest } from "../../utils/apiRequests";
import getImageUrl from "../../utils/imagetype";
import TextwithIconBtn from "./textwithiconbtn";
import convertTime from "../../utils/convertTimeformat";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import NametoprofileBtn from "../btns/nametoprofilebtn";
import DeletePostBtn from "../btns/deletepostBtn";


function PostListdesign(props){
    const checktheme = useTheme();
    const [cookies] = useCookies(["jwtforlifememory"]);
    const [likestate, setLikeState] = useState(false);
    const [sharestate, setShareState] = useState(false);
    const [postInfo, setPostInfo] = useState(Object);
    const [showpost, setShowpost] = useState(false);
    const [shownotfound, setShownotfound] = useState(true);
    const navigate = useNavigate();

    function imageUrl(){
        if(postInfo.image !== null || postInfo.image !== undefined){
            if(postInfo.image.data.length === 0){
                return null;
            }else{
                const url = getImageUrl(postInfo.image.data);
                return url;
            }
        }else{
            return null
        }
    }

    async function getpostDetail(){
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}post/getpost?postId=${props.postId}`,cookies.jwtforlifememory);
        if(response.status !== 200){
            
            setShowpost(true);
        }else{
            const data = await response.json();

            const postdata = data.message.postdetail;

            let likearray = postdata["likes"];
            likearray.map((singlelike) =>{
                if(singlelike === props.originaluserInfo._id){
                    setLikeState(true);
                }
            });
            let sharearray = postdata["contributes"];
            sharearray.map((singleshare)=>{
                if(singleshare === props.originaluserInfo._id){
                    setShareState(true);
                }
            });
            setPostInfo(postdata);
            setShownotfound(false);
            setShowpost(true);
            
        }
        
    }

    async function likefunc(){
        setLikeState(prev => !prev);
        // console.log(postInfo.postId);
        if(likestate === false){
            const response = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}post/givelikes?postId=${postInfo.postId}`,
                cookies.jwtforlifememory,
                null,
                );
            if(response.status === 200){
                // console.log("Liked successfully");
            }else{
                // console.log("Like Failed");
                setLikeState(false);
            }    
        }else{
            const response = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}post/deletelike?postId=${postInfo.postId}`,
                cookies.jwtforlifememory,
                null,
            );
            if(response.status === 200){
                // console.log("Unlike successfully");
            }else{
                // console.log("Like Failed");
                setLikeState(true);
            }        
        }
    }

    function commentfunc(){
        // setCommentState(prev => !prev);
        navigate(`/postdetail/${postInfo.postId}/${props.originaluserInfo._id}/${postInfo.userId}`);
    }

    async function sharefunc(){
        setShareState(prev => !prev);
        if(sharestate === false){
            const response = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}post/share?postId=${postInfo.postId}`,
                cookies.jwtforlifememory,
                null,
            );
            if(response.status === 200){
                // console.log("share successfully");
            }else{
                // console.log("share unsuccess");
                setShareState(false);
            }
        }else{
            const response = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}post/removeshare?postId=${postInfo.postId}`,
                cookies.jwtforlifememory,
                null,
            );
            if(response.status === 200){
                // console.log("unshare success");
            }else{
                // console.log("unshare unsuccess");
                setShareState(true);
            }
        }
    }

    useEffect(()=>{
        getpostDetail();
    },[])

    return (
        <>
        {
            showpost && <>
                {
                    shownotfound 
                        ?
                        <div className={`block backgroundClr w-auto h-auto mx-6 my-6 p-5 ${!checktheme && "shadow-sm shadow-gray-500"} rounded-md`}>
                            <p className="text-base text-center">Post not found</p>
                        </div>
                        :
                        <div
                            className={`block backgroundClr w-auto h-auto mx-6 my-6 p-5 ${!checktheme && "shadow-sm shadow-gray-500"} rounded-md`}>
                                <div className="flex justify-between items-center ">
                                    <div className="flex justify-start items-center">
                                        <img className="w-10 h-10 mr-5 rounded-full border border-cuswood" src={Logo} alt="profileimage" />
                                        <div className="flex justify-start items-start flex-col">
                                            {/* <span className="text-sm">{postInfo.userName}</span> */}
                                            <NametoprofileBtn name={postInfo.userName} accountId={postInfo.userId} userId={props.originaluserInfo._id}/>
                                            <span className="text-xs text-gray-500">{convertTime(postInfo.createDate)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            postInfo.userId === props.originaluserInfo._id
                                                &&
                                            <DeletePostBtn postId={postInfo.postId} /> 
                                        }
                                        <button
                                        onClick={commentfunc} 
                                        className="active:bg-gray-500 active:bg-opacity-20 text-cusblue rounded-md px-3 py-1">
                                            <span>View</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="py-3">
                                    <span className="text-sm">
                                        {postInfo.text === null ? "" : postInfo.text}
                                    </span>
                                </div>
                                {
                                    postInfo.image !== null &&  <div className="m-5">
                                    <img className="w-full bg-fuchsia-600 flex justify-center items-center" src={imageUrl()} alt="postimage" />
                                </div>
                                }
                                <div className="flex justify-around items-center">
                                    <TextwithIconBtn show={likestate} iconClass="fa-thumbs-up" txt="Like" btnfunc={likefunc} />
                                    <TextwithIconBtn show={false} iconClass="fa-message" txt="Comment" btnfunc={commentfunc} />
                                    <TextwithIconBtn show={sharestate} iconClass="fa-share" txt="Share" btnfunc={sharefunc} />
                                </div>
                            </div>
                }
            </>
            
        }
        </>
    );
}

export default PostListdesign;