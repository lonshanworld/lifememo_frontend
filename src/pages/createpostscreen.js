import React, { useRef, useState, useContext } from "react";
import {postApiRequest} from "../utils/apiRequests";
import { ShowLoadingContext } from "../customhooks/showloadingscreen";
import { UpdateShowErrorContext } from "../customhooks/errorhander";
import { useCookies } from "react-cookie";
import "../styles/postborder.css"
import { useNavigate } from "react-router-dom";

function CreatePostScreen(){
    const imageRef = useRef();
    const [showimage, setShowimage] = useState(false);
    const [cookies] = useCookies(["jwtforlifememory"]);
    const {toggleShowError} = useContext(UpdateShowErrorContext);
    const {toggleShowloading} = useContext(ShowLoadingContext);
    const textRef = useRef();
    const posttypeRef = useRef();
    const navigate = useNavigate();

    function previewimage(){
        var file = imageRef.current.files;
        if(file.length > 0){
            var filereader = new FileReader();
            filereader.onload = function (event){
                document.getElementById("imgpreview").setAttribute("src", event.target.result);
            };
            setShowimage(true);
            filereader.readAsDataURL(file[0]);
        }
    }

    function removeimage(e){
        e.preventDefault();
        document.getElementById("imgpreview").setAttribute("src", "");
        imageRef.current.value = "";
        setShowimage(false);
    }

   
    async function postFunc(e){
        e.preventDefault();
        toggleShowloading(true);
        const formdata = new FormData();
        formdata.append("txt", textRef.current.value);
        formdata.append("postType", posttypeRef.current.value);
        formdata.append("files",imageRef.current.files[0])

        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}post/sendpost`,
            cookies.jwtforlifememory,
            formdata,
        );
        toggleShowloading(false);
        if(response.status === 200){
            // console.log(response.status);
            navigate("/main");
        }else{
            // console.log(response.statusText);
            toggleShowError(true, response.statusText)
        }
    }

    return (
        <div className="w-screen flex-col justify-center items-center">
            <p className="font-bold text-left text-xl my-2 underline underline-offset-4 decoration-2 w-4/5 sm:w-3/5 mx-auto">
                Create post
            </p>
            <div className="mt-8 w-full sm:w-4/5 flex justify-center items-center mx-auto">
                <form className="postborder px-8 sm:px-8 py-5 w-11/12 sm:w-3/4 border-s-orange-700 backgroundClr shadow-sm shadow-gray-600">
                    <div className="mb-4">
                        <label htmlFor="posttype" className="text-gray-500 text-sm">Choose post type - </label>
                        <select
                        ref={posttypeRef}
                        className="bg-gray-500 bg-opacity-50 w-32 px-3 py-1 rounded-md" 
                        defaultValue="public" 
                        htmlFor="posttype">
                            <option value="public">public</option>
                            <option value="onlyfriend">onlyfriend</option>
                            <option value="onlyme">onlyme</option>
                        </select>
                    </div>
                    <textarea
                        ref={textRef}
                        className="w-full outline-none bg-transparent h-[20vh]"
                        placeholder="Life is not about appointments and work, it's about the moments you enjoy. Create your moment and post it as gift ...."
                    />
                    <div>
                        <label 
                        className="block mb-2 text-sm font-medium text-orange-700" htmlFor="file_input">Upload image</label>
                        <input 
                        ref={imageRef}
                        onChange={previewimage}
                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-xs font-normal text-gray-500 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none" 
                        id="file_input" type="file" accept="image/*"/>
                    </div>
                    {
                        showimage && <div className="relative">
                            <img
                            className="w-full md:w-1/2 h-1/2 rounded-md" 
                            id="imgpreview"/>
                            <button
                            onClick={removeimage}
                            className="absolute top-0 right-0 mr-3 mt-3 px-2 py-1 bg-red-500 rounded-md text-white active:bg-opacity-80">
                                Clear image
                            </button>
                        </div>
                    }
                    <button 
                    onClick={postFunc}
                    className="px-3 py-1 mt-8 text-base text-white bg-orange-700 rounded-md active:bg-opacity-70">
                        Post
                    </button> 
                </form>
            </div>
        </div>
    );
}

export default CreatePostScreen;