import React, {useContext} from "react";
import { useTheme } from "../../customhooks/usethemehook";
import { ShowLoadingContext } from "../../customhooks/showloadingscreen";
import { UpdateShowErrorContext } from "../../customhooks/errorhander";
import { postApiRequest } from "../../utils/apiRequests";
import { useCookies } from "react-cookie";

function DeletePostBtn(props){
    const checktheme = useTheme();
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const [cookies] = useCookies(["jwtforlifememory"]);

    async function deletepostFunc(){
        toggleShowloading(true);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}post/deletepost?postId=${props.postId}`,
            cookies.jwtforlifememory,
            null,
        );
        toggleShowloading(false);
        if(response.status === 200){
            window.location.reload();
        }else{
            toggleShowError(true, response.statusText);
        }
    }

    return (
        <button
        onClick={deletepostFunc} 
        className={`text-red-500 pr-3 border-r ${checktheme ? "border-white" : "border-black"}`}>
            <i className="fa-solid fa-trash-can fa-xl"></i>
        </button>   
    );
}


export default DeletePostBtn;