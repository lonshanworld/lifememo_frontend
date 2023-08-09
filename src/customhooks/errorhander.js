import React, { useState } from "react";
import Errorbox from "../components/errorbox";
// import { useContext } from "react";

const UpdateShowErrorContext = React.createContext();


function ErrorHandler({children}){
    const [showerror, setShowerror] = useState(false);
    const [errortext, setErrortext] = useState("Something went wrong");

    function toggleShowError(boolvalue,value){
        setErrortext(value);
        setShowerror(boolvalue);
    }

    function btnfunction(){
        setShowerror(false);
        setErrortext("");
    }
    return (
        <UpdateShowErrorContext.Provider value={{toggleShowError}}>
            {
                showerror && <Errorbox title="Error" text={errortext} showboxFunc={btnfunction}/>
            }
            {children}
        </UpdateShowErrorContext.Provider>
    );
}

export default ErrorHandler;
export {UpdateShowErrorContext};