import React from "react";
import { ClockLoader } from 'react-spinners';

function Loadingbox(){
    
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-50 flex justify-center items-center z-40">
            <div className="sweet-loading">
                <ClockLoader color={'#49281F'} loading={true} />
            </div>
        </div>
    );
}

export default Loadingbox;