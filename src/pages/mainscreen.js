import React, { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loadingbox from "../components/loadingbox";
import {getApiRequest} from "../utils/apiRequests";
import Errorbox from "../components/errorbox";
import Leftmenu from "./leftmenu";
import Rightchat from "./rightchat";
import Menudrawer from "../components/drawers/menudrawer";
import Chatdrawer from "../components/drawers/chatdrawer";
import getImageUrl from "../utils/imagetype";

import Middlepartpost from "../components/middlepostscreenparts/middlepartpost";
import ChatScreen from "./chatscreen";

const ShowChatScreenContext = React.createContext();


function MainScreen(){
    const [cookies] = useCookies(["jwtforlifememory"]);
    // const controller = new AbortController();
    // const signal = controller.signal;
    const [dataobject, setDataobject] = useState();
    const [loadingbool, setLoadingbool] = useState(true);
    const [imagedata, setImagedata] = useState();
    const [showerror, setShowerror] = useState(false);
    const [errortext, setErrorText] = useState("");
    const [showmenu, setShowmenu] = useState(false);
    const [showchat, setShowchat] = useState(false);
    const [showchatscreen, setShowchatScreen] = useState(false);
    const [chatid, setChatid] = useState("");

    async function getuserData(){
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user/profile`,cookies.jwtforlifememory);
        if(response.status === 200){
            const responsetext = await response.json();
            setDataobject(responsetext.message.userdata);
            if(responsetext.message.userdata.profileImg != null){
                await getImagedata(responsetext.message.userdata.profileImg);
            }
            setLoadingbool(false);
        }else{
    
            setErrorText(response.statusText);
            
            setShowerror(true);
        }
        
        
    }

   
    async function getImagedata(imgId){
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}image?imageId=${imgId}`, cookies.jwtforlifememory);

        if(response.status === 200){
            const responsetext = await response.json();

            const url = getImageUrl(responsetext.message.imageDetailInfo.image.data);
            setImagedata(url);
        }else{
       
    
            setErrorText(response.statusText);
            
            setShowerror(true);
        }
    }

    function showErrorBox(){
        // console.log("function react here");
        setShowerror(false);
    }

    function showMenuFunc(){
       
        if(showchat === false){
            setShowmenu(!showmenu);
        }else if(showchat === true){
            setShowchat(!showchat);
            setShowmenu(!showmenu);
        }
    }

    function showChatFunc(){

        if(showmenu === false){
            setShowchat(!showchat);
        }else if(showmenu === true){
            setShowmenu(!showmenu);
            setShowchat(!showchat);
        }
    }

    function showchatscreenFunc(value, id){
        // console.log("This is chat id " + id);
        setShowchatScreen(value);
        setChatid(id);
    }

    const SetChatScreen = useCallback(()=>{
        return <ChatScreen id={chatid} originaluserInfo={dataobject}/>;
    },[chatid])

    useEffect(()=>{
        // const controller = new AbortController();
        // const signal = controller.signal;
        getuserData();
        // return () =>{
        //     console.log("controller aborted");
        //     controller.abort();
        // };
    },[]);

    return (
        <>  
            {
                showerror && <Errorbox title="Error in Login Form" text={errortext} showboxFunc={showErrorBox}/>
            }
            {
                loadingbool ? 
                <Loadingbox /> :
                <ShowChatScreenContext.Provider value={{showchatscreenFunc}} >
                     <div className="w-full h-screen block sm:grid sm:grid-cols-5 lg:grid-cols-4">
                        <Menudrawer showvalue={showmenu} showFunc={showMenuFunc}/>
                        <Leftmenu showvalue={showmenu} userInfo={dataobject}/>
                        <div className="w-full h-full sm:col-span-3 lg:col-span-2 relative">
                        {
                            (showchatscreen)
                                ?
                            <SetChatScreen />
                                :   
                            <Middlepartpost text={dataobject.userName} imgurl={imagedata} originaluserInfo={dataobject}/>
                        }
                            {/* <Routes>
                                <Route path="/post" Component={<Middlepartpost text={dataobject.userName} imgurl={imagedata} originaluserInfo={dataobject}/>} />
                                <Route path="/chat" Component={<Middlepartchat id={chatid} />} />
                            </Routes> */}
                        </div>
                        <Rightchat showvalue={showchat} userData={dataobject}/>
                        <Chatdrawer showvalue={showchat} showFunc={showChatFunc}/>
                    </div>
                </ShowChatScreenContext.Provider>
            }
        </>
        
    );
}

export default MainScreen;
export {ShowChatScreenContext};