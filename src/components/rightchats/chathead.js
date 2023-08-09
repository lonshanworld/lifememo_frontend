import React, { useContext, useEffect, useState } from "react";
import { getApiRequest } from "../../utils/apiRequests";
import { useCookies } from "react-cookie";
import Logo from "../../assets/logo.png";
import getImageUrl from "../../utils/imagetype";
import { ShowChatScreenContext } from "../../pages/mainscreen";

function ChatHead(props){
    const [userData, setUserdata] = useState(Object);
    const [imageurl , setImageurl] = useState();
    const [cookies] = useCookies(["jwtforlifememory"]);
    const {showchatscreenFunc} = useContext(ShowChatScreenContext);

    async function getUserdata(value){
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user?userId=${value}`, cookies.jwtforlifememory);
        const data = await response.json();
        setUserdata(data.message.userData);
        // console.log(data.message.userData.profileImg);
        if(data.message.userData.profileImg !== null){
            const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}image?imageId=${data.message.userData.profileImg}`, cookies.jwtforlifememory);
            const responsetext = await response.json();
            // console.log(responsetext);
            const url = getImageUrl(responsetext.message.imageDetailInfo.image.data);
            setImageurl(url);
        }
    }

    function tapchathead(){
        props.setactiveIdFunc();
        showchatscreenFunc(true, props.Id);
    }

    useEffect(()=>{

        getUserdata(props.Id);
    },[props.Id]);

    return (
        <div className="mx-5 h-12">
            <button
            onClick={tapchathead}
            className={`flex justify-start w-full border-b border-gray-500 items-center hover:text-blue-500 active:bg-gray-300 active:text-blue-500 ${(props.Id === props.activeId) && "text-blue-500"}`}>
                <img
                className="h-12 w-12 p-1.5 rounded-full" 
                src={imageurl === undefined ? Logo : imageurl} />
                <span className="truncate">{userData.userName}</span>
            </button>
        </div>
    );
}

export default ChatHead;