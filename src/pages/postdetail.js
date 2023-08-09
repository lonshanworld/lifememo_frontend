import React, { useEffect, useReducer, useState,useContext, useCallback ,useRef} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useTheme } from "../customhooks/usethemehook";
import Postdetailbtns from "../components/btns/postdetailbtns";
import LikeBox from "../components/btns/tinybox/likebox";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import { getApiRequest, postApiRequest } from "../utils/apiRequests";
import { useCookies } from "react-cookie";
import { UpdateShowErrorContext } from "../customhooks/errorhander";
import convertTime from "../utils/convertTimeformat";
import CommentBox from "../components/btns/tinybox/commentbox";
import NametoprofileBtn from "../components/btns/nametoprofilebtn";
import EmojiPicker from "emoji-picker-react";
import DeletePostBtn from "../components/btns/deletepostBtn";


const boxarray=[
    "Likes",
    "Comments",
    "Shares",
];

// const initialState = {
//     likes : 30,
//     comments : 100,
//     shares : 0,
// };

// function reducer(state, action){
//     switch(action.type){
//         case boxarray[0] :
//             return {
//                 ...state,
//                 likes : action.payload,
//             };
//         case boxarray[1] : 
//             return {
//                 ...state,
//                 comments : action.payload,
//             };   
//         case boxarray[2] : 
//             return {
//                 ...state,
//                 shares : action.payload,
//             };  
//         default :
//             return {
//                 ...state
//             };          
//     }
// }

function Postdetail(){
    const checktheme = useTheme();
    const [cookies] = useCookies(["jwtforlifememory"]);
    const {postId} = useParams();
    const {userId} = useParams();
    const {accountId} = useParams();
    const [minititle, setMinititle] = useState(boxarray[1]);
    const [postdetail, setpostdetail] = useState();
    const [showpost, setShowpost] = useState(false);
    // const [likelist, setLikelist] = useState([]);
    // const [sharelist, setSharelist] = useState([]);
    // const [commentlist, setCommentlist] = useState([]);
    // const [state, dispatch] = useReducer(reducer,initialState)
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const [showemoji, setShowemoji] = useState(false);
    const txtref = useRef();


    async function getFetchData(){
        toggleShowloading(true);
        const response = await getApiRequest(
            `${process.env.REACT_APP_BASE_API}post/postdetail?postId=${postId}`,
            cookies.jwtforlifememory,
        );
        if(response.status === 200){
            const data = await response.json();
            setShowpost(true);
            setpostdetail(data.postDetail);
            toggleShowloading(false);
        }else{
            toggleShowloading(false);
            toggleShowError(true, response.statusText);
        }
    }

    const classtext=(text)=>{
        switch(text){
            case boxarray[0] :
                return "fa-thumbs-up";
            case boxarray[1] :
                return "fa-message";
            case boxarray[2] :
                return "fa-share";    
            default :
                return null;
        }
    }

    function chageminititle(text){
        setMinititle(text);
        // dispatch({
        //     type : text,
        //     payload : 10,
        // });
    }

    function getcount(text){
        switch(text){
            case boxarray[0] :
                return postdetail.postData.likedBy.length;
            case boxarray[1] :
                return postdetail.postData.messages.length;
            case boxarray[2] :
                return postdetail.postData.shares.length;    
            default :
                return postdetail.postData.likeBy.length;
        }
    }

    function clickshowEmoji(){
        setShowemoji(prev =>!prev);
    }

    function putemojistring(value){
        txtref.current.value += value.emoji;
    }

    async function submitFunc(e){
        e.preventDefault();
        toggleShowloading(true);
        try{
            const formdata = new FormData();
            formdata.append("text", txtref.current.value);
            const sendmessage = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}post/givecomment?postId=${postId}`,
                cookies.jwtforlifememory,
                formdata,
            );
            if(sendmessage.status === 200){
                toggleShowloading(false);
                await getFetchData();
                txtref.current.value = ""
            }else{
                toggleShowError(true,sendmessage.statusText);
            }
        }catch{
            toggleShowError(true,"Something went wrong.  Please try again later");
        }
        



        // txtref.current.value = "";
    }

    const ItemList = ()=>{
        // console.log("Is this triggering again???")
        switch(minititle){
            case boxarray[0] :
                return postdetail.likeList.map((e) =><LikeBox name={e.name} image={e.image} accountId={e.id} userId={userId} key={e.id} />).reverse();
            case boxarray[1] :
                return postdetail.messageList.map((e) =><CommentBox userId={userId} data={e} key={e.messageid} />).reverse();
            case boxarray[2] :
                return postdetail.shareList.map((e)=><LikeBox name={e.name} image={e.image} accountId={e.id} userId={userId} key={e.id} />).reverse();    
            default :
                return null;   
        }
    };

    useEffect(()=>{
        getFetchData();
        // console.log("This is post Id " + postId);
    },[]);

    return(
        <>
            {
                showpost &&  <div className="w-screen h-screen md:flex justify-center items-center">
                    <div className="w-full md:w-1/2 md:h-screen px-6 pt-6 pb-3 overflow-y-scroll flex-col justify-center items-center">
                        <div className={`p-5 lg:w-3/4 backgroundClr ${!checktheme && "shadow-sm shadow-gray-500"} rounded-md mx-auto`}>
                            <div className="flex justify-between items-center">
                                <div className="flex justify-start items-center">
                                    <img className="w-10 h-10 mr-5 rounded-full border border-cuswood" src={postdetail.createrData.profileImg === null ? Logo : postdetail.createrData.profileImg} alt="profileimage" />
                                    <div className="flex justify-start items-start flex-col">
                                        {/* <span className="text-sm">{postdetail.createrData.userName}</span> */}
                                        <NametoprofileBtn name={postdetail.createrData.userName} accountId={accountId} userId={userId} />
                                        <span className="text-xs text-gray-500">{convertTime(postdetail.postData.createDate)}</span>
                                    </div>
                                </div>
                                {
                                    (postdetail.createrData.id === userId) && <DeletePostBtn postId={postId} />
                                }   
                            </div>
                            {
                                (postdetail.postData.bodyText !== null) && <div className="py-3">
                                    <span className="text-sm">
                                        {postdetail.postData.bodyText}
                                    </span>
                                </div>
                            }
                            
                            {
                                (postdetail.postData.bodyImageUrl !== null) && <div className="">
                                    <img className="w-full bg-fuchsia-600 flex justify-center items-center" src={postdetail.postData.bodyImageUrl} alt="postimage" />
                                </div>
                            }
                            
                        </div>
                        <div className={`lg:w-3/4 backgroundClr mt-5 mx-5 rounded-lg flex ${!checktheme && "shadow-sm shadow-gray-500"} mx-auto`}>
                            <button
                            onClick={clickshowEmoji} 
                            className="p-3 active:bg-gray-500 active:bg-opacity-30 rounded-full">
                                <i className="fa-regular fa-face-smile fa-xl"></i>
                            </button>
                            <form 
                            className="w-full bg-transparent flex justify-center items-center"
                            onSubmit={submitFunc}>
                                <input
                                ref={txtref}
                                type="text"
                                className="w-full bg-transparent outline-none px-2" 
                                placeholder="Enter your comment" />   
                            </form>
                            <button
                            onClick={submitFunc} 
                            className="p-3 active:bg-gray-500 active:bg-opacity-30 rounded-full">
                                <i className="fa-regular fa-paper-plane fa-xl"></i>
                            </button>
                        </div>
                        { showemoji && <div className="mx-auto w-5/6 lg:w-3/5 relative mt-5">
                            <button
                            onClick={clickshowEmoji}
                            className="absolute z-10 -left-3 -top-3 rounded-full bg-lime-200 text-cuswood active:text-white p-1">
                                <i className="fa-regular fa-circle-xmark fa-xl"></i>
                            </button>
                            <EmojiPicker
                            onEmojiClick={putemojistring} 
                            width="100%"/>
                        </div>}
                    </div>
                    <div className="w-full md:w-1/2 md:h-screen pt-3 pb-6 flex justify-center">
                        <div className="w-full md:w-5/6">
                            <div className="border-y border-gray-500">
                                <div className="flex justify-around items-center py-2">
                                    {
                                        boxarray.map((txt)=><Postdetailbtns text={txt} classtxt={classtext} func={chageminititle} count={getcount} key={txt} />)
                                    } 
                                </div>
                            </div>
                            <div className="my-4 text-center">
                                <p className="font-bold text-base inline-block border-b-4 border-cuswood">{minititle}</p>
                                <div className={`bg-blue-200 my-3 mx-3 p-3 backgroundClr ${!checktheme && "shadow-sm shadow-gray-500"} rounded-md md:h-[calc(100vh-140px)] overflow-y-scroll`}>
                                    <ItemList/>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            }
        </>
    );
}

export default Postdetail;