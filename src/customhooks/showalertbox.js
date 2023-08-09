import React, {useState} from "react";
import Errorbox from "../components/errorbox";

const UpdateShowAlertContext = React.createContext();

function AlertHandler({children}){
    const [showalert, setShowalret] = useState(false);
    const [alerttext, setAlerttext] = useState("Something went wrong");

    function toggleAlertBox(boolvalue, value){
        setShowalret(boolvalue);
        setAlerttext(value)
    }

    function btnfunction(){
        setShowalret(false);
        setAlerttext("");
    }

    return (
        <UpdateShowAlertContext.Provider value={{toggleAlertBox}}>
            {
                showalert && <Errorbox title="Alert" text={alerttext} showboxFunc={btnfunction}/>
            }
            {children}
        </UpdateShowAlertContext.Provider>
    );
}


export {UpdateShowAlertContext};
export default AlertHandler;