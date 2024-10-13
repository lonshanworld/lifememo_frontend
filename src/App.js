import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Logo from "./assets/logo.png";
import { getApiRequest } from "./utils/apiRequests";


function App() {
  const [cookies] = useCookies(["jwtfornotememo"]);
  const navigate = useNavigate();

  function getcurrentyear(){
    const year = document.getElementById("year");
    let date = new Date();
    let curyear = date.getFullYear();
    year.innerText = curyear;
  }

  function gotoLoginpage(){
    navigate("admin/login");
  }

  useEffect(()=>{
    getcurrentyear();
    let countdownId;
    if(cookies.jwtfornotememo === undefined){
      countdownId = setTimeout(()=>{
        navigate("/login");
      },4000);
    }else{
      countdownId = setTimeout(async()=>{
        const response = await getApiRequest(`${process.env.REACT_APP_BASE_API}user/profile`,cookies.jwtfornotememo);
        if(response.status === 200){
          const responsetext = await response.json();
          // console.log("userData ---",responsetext.message.userdata.role);

          if(responsetext.message.userdata.role === "admin"){
            navigate("/package");
          }else{
            navigate("/main");
          }
        }else{
          navigate("/main");
        }
        
      },3000);
    }

    return()=>{
      clearTimeout(countdownId);
    }
  },[]);


  return (
    <div className="App w-full h-full flex justify-center items-center flex-col">
      <img src={Logo} className="w-2/6 md:w-1/6" alt="logo"/>
      <div
      className="flex flex-col justify-center items-center pt-8">
        <p
        className="text-lg font-semibold text-blue-400">Are you admin?</p>
        <button
        className="border border-cusgreenlight active:text-white active:bg-cusgreen px-3 py-1 rounded-md"
        onClick={gotoLoginpage}
        >Click to go to admin login within 4 seconds</button>
      </div>
      <p
      className="absolute bottom-5">Copyright &copy; <span id="year"></span>.  All rights reserved to Note-Memo.</p>
    </div>
  );
}

export default App;
