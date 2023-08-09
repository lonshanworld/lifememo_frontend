import React, { useEffect,useState,useContext, useRef, useCallback } from "react";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";
import { getApiRequest } from "../utils/apiRequests";
import getImageUrl from "../utils/imagetype";
import { ShowChatScreenContext } from "../pages/mainscreen";
import messageModel from "../models/message_model";
import Logo from "../assets/logo.png";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import Chatmessage from "../components/rightchats/chatmessage";
import VideoCall from "../components/rightchats/videocall";
import Peer from "peerjs";
import ShowCallingbtn from "../components/btns/showcallingbtn";
import { UpdateShowAlertContext } from "../customhooks/showalertbox";
import CalltxtBox from "../components/btns/calltxtbox";
import VoiceCall from "../components/rightchats/voicecall";


function ChatScreen(props){
    const [cookies] = useCookies(["jwtforlifememory"]);
    const [frienddata, setFrienddata] = useState(Object);
    const [imgurl, setImgurl] = useState("");
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const {toggleAlertBox} = useContext(UpdateShowAlertContext);
    const [originuserimgurl , setOriginuserimgurl] = useState("");
    const [ChatList, setChatlist] = useState([]);
    const [chatroomId, setChatroomId] = useState("");
    
    const {showchatscreenFunc} = useContext(ShowChatScreenContext);

    const [showCall , setShowCall] = useState(false)
    const [showacceptcall, setShowacceptcall] = useState(false);
    const inputRef = useRef();
    const myvideoRef = useRef();
    const othervideoRef = useRef();
    const [mystream, setmyStream] = useState(null);
    // const [otherstream, setOtherstream] = useState(null);
    const [othersocketId, setOthersocketId] = useState(null);
    const [otherpeerId, setOtherpeerId] = useState(null);
    const [showcalling, setShowcalling] = useState(false);

    const [showVoice, setShowVoice] = useState(false);
    const [showVoiceCalling, setShowVoiceCalling] = useState(false);
    const [showAcceptVoice, setShowAcceptVoice] = useState(false);

    const [isVideo, setIsVideo] = useState(false);
    
    const socket = io(`http://localhost:5000`,{
        path : "/chatsocket"
    });

    const mypeer = new Peer(
        // undefined,
        // {
        //     host : "localhost",
        //     port : "49667",
        //     path : "/callserver"
        // }
    )
    

    function changelist (newmessage){
        
        const scroller = document.getElementById("scrollcontroller");
    
        setChatlist(prevarr => [...prevarr, newmessage]);

        scroller.scrollTop = scroller.scrollHeight;
        
    };

    function sendMessagefunc(e){

        e.preventDefault();
     
        const newmessage = {
            userName : props.originaluserInfo.userName,
            userId : props.originaluserInfo._id,
            text : inputRef.current.value,
            img : null
        };
        socket.emit("sendMessage",newmessage,chatroomId);
        
        inputRef.current.value = "";
        
    }

    async function getImagedata(imgId){
        if(imgId !== null){
            const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}image?imageId=${imgId}`, cookies.jwtforlifememory);
            const responsetext = await response.json();

            const url = getImageUrl(responsetext.message.imageDetailInfo.image.data);
            setImgurl(url);
        }
    }

    async function getfriendData(){
        const response = await getApiRequest(
            `${process.env.REACT_APP_BASE_API}user?userId=${props.id}`,
            cookies.jwtforlifememory,
        );
        const data = await response.json();
        setFrienddata(data["message"]["userData"]);
        getImagedata(data["message"]["userData"]["profileImg"]);
    }

    async function getcurrentuserprofile(){
        if(props.originaluserInfo.profileImg !== null){
            const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}image?imageId=${props.originaluserInfo.profileImg}`, cookies.jwtforlifememory);
            const responsetext = await response.json();

            const url = getImageUrl(responsetext.message.imageDetailInfo.image.data);
            setOriginuserimgurl(url);
        }
    }
    
    

    async function getchatsocketid(){
        const response = await getApiRequest(
            `${process.env.REACT_APP_BASE_API}chat?friendId=${props.id}`,
            cookies.jwtforlifememory,
        );
        const data = await response.json();
        const chatId = data["chatId"];
        // console.log("This is chat Id " + chatId);
        // console.log("This is chat Id from main screen " +props.id )
        setChatroomId(chatId);
        const responsechatlist = await getApiRequest(
            `${process.env.REACT_APP_BASE_API}chat/getmessages?chatId=${chatId}&startnum=0&amount=20`,
            cookies.jwtforlifememory,
        );
        const datalist = await responsechatlist.json();
        const reversedatalist = datalist.reverse();
        for(let a = 0; a < reversedatalist.length; a++){
            const newmessage = new messageModel(
                reversedatalist[a]._id === props.originaluserInfo._id ? props.originaluserInfo.userName : frienddata.userName,
                reversedatalist[a].userId,
                reversedatalist[a]._id === props.originaluserInfo._id ? originuserimgurl : imgurl,
                reversedatalist[a].txt,
                null,
                reversedatalist[a].createDate,
            );
            changelist(newmessage);
        }   

        startsocket(chatId);

    }

    const fetchdata = async()=>{
        toggleShowloading(true);
        await getfriendData();
        await getcurrentuserprofile();
        await getchatsocketid();
        toggleShowloading(false);
    }


    const allchatlist = useCallback(()=>{
        return ChatList;
    },[ChatList]);


    function startsocket(chatid){
        socket.emit("joinRoom", chatid);   
        socket.on("receiveMessage",(txt)=>{
          
            const newmessage = new messageModel(
                txt["userName"],
                txt["userId"],
                txt["userId"] === props.originaluserInfo._id ? originuserimgurl : imgurl,
                txt["text"],
                txt["img"],
                txt["datetime"], 
            );
            changelist(newmessage)
        });
        
        socket.on("sendsocketIds",(idlist)=>{
            idlist.forEach(singleid =>{
                if(singleid !== socket.id){
                    setOthersocketId(singleid);
                    socket.emit("sendpeerid", [chatid, mypeer.id]);
                }
            });
        });

        socket.on("receivepeerId", (peerid)=>{
            setOtherpeerId(peerid);
        });


        mypeer.on("open", (id)=>{
        });
        
        mypeer.on("call", call =>{
            
            if(isVideo){
                setShowCall(true);
            }else{
                setShowVoice(true);
            }
            navigator.mediaDevices.getUserMedia({
                video : isVideo,
                audio : true,
            }).then((stream) =>{
                setmyStream(stream);
                setShowcalling(false);
                setShowVoiceCalling(false);
                if(myvideoRef.current !== null){
                    myvideoRef.current.srcObject = stream;
                }else{
                    toggleAlertBox(true, "Media devices not found");
                }
                call.answer(stream);
                
                call.on("stream", otherstream =>{
                    if(othervideoRef.current !== null){
                        othervideoRef.current.srcObject = otherstream;
                    }else{
                        toggleAlertBox(true, "Media devices not found");
                    }
                });
                call.on("close", ()=>{
                    // othervideoRef.current.srcObject = null;
                    othervideoRef.current.close();
                });
                
            });
        });

        socket.on("plzacceptcall",()=>{
            // othervideoRef.current.srcObject = otherstream;
            // setIsVideo(true);
            setShowacceptcall(true);
        });

        socket.on("plzacceptvoice", ()=>{
            // setIsVideo(false);
            setShowAcceptVoice(true);
        });

        socket.on("dropcall",()=>{
            if(othervideoRef.current !== null){
                othervideoRef.current.srcObject = null;
            }
        });

        socket.emit("getallsocketId",chatid);

        mypeer.on("disconnect",()=>{
            if(othervideoRef.current !== null){
                othervideoRef.current.srcObject = null;
            }
        });
    }

    async function acceptCall(){
        setShowacceptcall(false);
        setShowCall(true);
        navigator.mediaDevices.getUserMedia({
            video : true,
            audio : true,
        }).then(stream =>{
            setmyStream(stream);
            if(myvideoRef.current !== null){
                myvideoRef.current.srcObject = stream;
            }else{
                toggleAlertBox(true, "Media devices not found");
            }
            const call = mypeer.call(otherpeerId, stream);
            call.on("stream", otherstream =>{
                if(othervideoRef.current !== null){
                    othervideoRef.current.srcObject = otherstream;
                }else{
                    toggleAlertBox(true, "Media devices not found");
                }
            });
            call.on("close", ()=>{
                // othervideoRef.current.srcObject = null;
                if(othervideoRef.current !== null){
                    othervideoRef.current.close();
                }
            });
        });
        
    }

    function callother(){
        if(othersocketId !== null){
            setShowcalling(true);
            setIsVideo(true);
            socket.emit("callother", othersocketId);
        }else{
            toggleAlertBox(true, `${frienddata["userName"]} is not online`);
        }
    }


    function endCall(){
        socket.emit("dropcall", othersocketId);
        setShowCall(false);
        setShowVoice(false);
        myvideoRef.current.srcObject = null;
        if(othervideoRef.current !== null){
            othervideoRef.current.srcObject = null;
        }
        if(mystream !== null){
            mystream.getTracks().forEach((track)=>{
                // if(track.readyState !== "ended"){
                //     track.st
                // }
                track.stop();
            });
        }
        setmyStream(null);
        // setOtherstream(null);
     
    }




    function callvoice(){
        if(otherpeerId !== null){
            setShowVoiceCalling(true);
            setIsVideo(false);
            socket.emit("callothervoice", othersocketId);
        }else{
            toggleAlertBox(true, `${frienddata["userName"]} is not online`);
        }
    }

    function acceptvoice(){
        setShowAcceptVoice(false);
        setShowVoice(true);
        navigator.mediaDevices.getUserMedia({
            video : false,
            audio : true,
        }).then(stream =>{
            setmyStream(stream);
            myvideoRef.current.srcObject = stream;
            const call = mypeer.call(otherpeerId, stream);
            call.on("stream", otherstream =>{
                othervideoRef.current.srcObject = otherstream;
            });
            call.on("close", ()=>{
                // othervideoRef.current.srcObject = null;
                if(othervideoRef.current !== null){
                    othervideoRef.current.close();
                }
            });
        });
    }


    // async function textpeerbtn(){
    //     console.log("This is my socket id " + socket.id);
    //     console.log('This is other socket id ' + othersocketId);
    //     console.log("This is my peer id " + mypeer.id);
    //     console.log("this is other peer id " + otherpeerId);
    //     console.log("this is room id " + chatroomId);
    //     console.log(myvideoRef);
    // }

    useEffect(()=>{
        fetchdata();
       
        return () => {
            socket.disconnect();
            socket.close();
            mypeer.disconnect();

        };
    },[isVideo]);

    return (
        <div 
        id="chatdimension"
        className="relative h-screen w-full">
            
            <div className="absolute z-10 px-8 appbarshadow h-12 w-full bg-cuswood flex justify-between items-center flex-row rounded-b-lg">
                <div className="text-white">
                    <button
                    onClick={()=>showchatscreenFunc(false, "")} 
                    className="border border-white rounded-full w-7 h-7">
                        <i className="fa-solid fa-angle-left fa-lg"></i>
                    </button>
                    <span className="pl-2">Go back to new feeds</span>
                </div>
                <div>
                    <button
                    onClick={callvoice} 
                    className="button mr-2">
                        <i className="fa-solid fa-phone fa-lg"></i>
                    </button>
                    <button
                    onClick={callother}  
                    className="button ml-2">
                        <i className="fa-solid fa-video fa-lg"></i>
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center pt-12 w-full bgClr">
                <div className="flex justify-center items-center w-4/6 border-b border-cuswoodlight h-12">
                    <img src={imgurl === "" ? Logo : imgurl} className="rounded-full h-10 w-10"/>
                    <span className="pl-2 text-sm truncate">{frienddata["userName"]}</span>
                </div>
            </div>
            {
                showacceptcall && 
                <ShowCallingbtn func={acceptCall} txt={`${frienddata["userName"]} is calling you with video.`} btntxt="Accept"/> 
            }
            {
                showcalling && 
                <CalltxtBox txt="Video chat calling ...." />
            }
            {
                showCall && 
                <VideoCall myvideo={myvideoRef} othervideo={othervideoRef} getvideoFunc={endCall}/>
            }
            {
                showAcceptVoice && 
                <ShowCallingbtn func={acceptvoice} txt={`${frienddata["userName"]} is calling you with audio.`} btntxt="Accept"/> 
            }
            {
                showVoiceCalling && 
                <CalltxtBox txt="Voice chat calling ...." />
            }
            {
                showVoice && 
                <VoiceCall myaudio={myvideoRef} otheraudio={othervideoRef} endcallFunc={endCall} />
            }
            <div 
            id="scrollcontroller"
            className="w-full z-0 max-h-screen overflow-y-scroll flex-col absolute bottom-14 pb-5 pt-36">
                {/* {
                    AllChatList.map((chat)=><Chatmessage chatobj={chat} currentuserId={props.originaluserInfo._id} />)
                } */}
                <Chatmessage allchat={allchatlist} currentuserId={props.originaluserInfo._id} friendImg={imgurl} selfImg={originuserimgurl}/>
            </div>
            <div className="backgroundClr txtinputshadow bottom-0 h-14 w-full absolute flex justify-evenly items-center rounded-t-lg">
                <i className="fa-solid text-gray-400 fa-image fa-xl active:bg-gray-500 hover:bg-gray-500 active:text-white hover:text-white px-2.5 py-5 ml-2 rounded-full transition-all ease-in-out duration-200"></i>
                <i className="fa-solid text-gray-400 fa-video fa-xl active:bg-gray-500 hover:bg-gray-500 active:text-white hover:text-white px-2.5 py-5 mx-2 rounded-full transition-all ease-in-out duration-200"></i>
                <form onSubmit={sendMessagefunc} className="h-full w-full flex justify-center items-center">
                    <input 
                    className="bgClr w-full h-8 px-4 rounded-full border-2 border-blue-500 outline-none"
                    ref={inputRef}/>
                </form>
                <i 
                className="fa-solid z-10 text-gray-400 fa-paper-plane fa-xl active:bg-gray-500 hover:bg-gray-500 active:text-white hover:text-white px-2.5 py-5 mx-2 rounded-full transition-all ease-in-out duration-200"
                onClick={sendMessagefunc}></i>
            </div>
        </div>
    );
}

export default ChatScreen;