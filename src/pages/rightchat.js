import React,{useState,useEffect, useCallback} from "react";
import ChatHead from "../components/rightchats/chathead";

function Rightchat(props){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [classvalue, setClasevalue] = useState("fixed w-60 h-5/6 my-14 translate-x-64 z-20");
    const [friendarrayId, setFriendarrayId] = useState([]);
    const [activeId, setActiveId] = useState("");

    function handlesize(){
        setWindowWidth(window.innerWidth);
    }

    function changeActiveId(){
        // console.log(this.Id);
        setActiveId(this.Id);
    }

    
    useEffect(()=>{
        let idlist = props.userData.friends;
        let newList = [];
        idlist.map(item => {
            if(item !== props.userData._id) newList.push(item);
        } );
        setFriendarrayId(newList);
    },[props.userData]);

    useEffect(()=>{
        window.addEventListener("resize",handlesize);
        if(windowWidth < 640){
            if(props.showvalue === true){
                setClasevalue("fixed top-0 right-0 w-60 h-5/6 my-14 translate-x-0 z-20");
            }else{
                setClasevalue("fixed top-0 right-0 w-60 h-5/6 my-14 translate-x-64 z-20");
            }
        }else{
            setClasevalue("sm:col-span-2 lg:col-span-1 sm:block h-5/6 w-4/5 mx-auto my-auto");
        }

        return () =>{
            window.removeEventListener("resize",handlesize);
        };
    },[windowWidth,props.showvalue]);


    return (
        <div className={`rightsidepageshadow transition-all transform duration-500 ease-in-out ${classvalue} backgroundClr rounded-2xl overflow-y-scroll`}>
            <p className="h-12 text-lg text-center py-2 border-b-2 border-blue-500">Chats</p>
            <div className="w-full">
                {
                    friendarrayId.map(Id => <ChatHead Id={Id} key={Id} setactiveIdFunc={changeActiveId} activeId={activeId} />)
                }
            </div>
        </div>
    );
}

export default Rightchat;