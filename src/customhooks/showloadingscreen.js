import React, { useState } from "react";
import Loadingbox from "../components/loadingbox";

const ShowLoadingContext = React.createContext();

function ShowLoadingScreen({children}){
    const [showloading, setShowloading] = useState(false);

    function toggleShowloading(value){
        setShowloading(value);
    }

    return (
        <ShowLoadingContext.Provider value={{toggleShowloading}}>
            {
                showloading && <Loadingbox/>
            }
            {children}
        </ShowLoadingContext.Provider>
    );
}

export default ShowLoadingScreen;
export {ShowLoadingContext};