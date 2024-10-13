import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import { deleteApiRequest, getApiRequest, postApiRequest } from "../../utils/apiRequests";
import Loadingbox from "../../components/loadingbox";
import CreatePackage from "../../components/package/create_package";
import PaymentPopup from "../../components/package/payment";
import Errorbox from "../../components/errorbox";
import { useNavigate } from "react-router-dom";

export default function PackageScreen(){
    const [cookies,setCookie, removeCookie] = useCookies(["jwtfornotememo"]);
    const [userData, setUserData] = useState();
    const [packageList, setPackageList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [showCreatePackage, setShowCreatePackage] = useState(false);

    const [showPayment, setShowPayment] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState();
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showNotiList, setShowNotiList] = useState(false);

    const navigate = useNavigate();

    function returnUnit(stringData){
        if(stringData === "post"){
            return "posts";
        }else{
            return "Hrs"
        }
    }

    async function requestPackage(paymentString){
        
        if(paymentString && selectedPackage ){
            setShowLoading(true);
            const result = await postApiRequest(
                `${process.env.REACT_APP_BASE_API}purchase/purchasePackage`,
                cookies.jwtfornotememo,
                JSON.stringify({
                    packageId : selectedPackage._id
                }),
            );

            console.log("result after purchase", result.status);
            setShowLoading(false);
            setPaymentSuccess(true);
        }
    }

    function showPaymentFunc(item){
        setSelectedPackage(item);
        setShowPayment(true);
    }

    function closePaymentFunc(){
        setShowPayment(false);
        setSelectedPackage(undefined);
    }

    async function logoutFunc(){
        // console.log("testing 123")
        // toggleShowError("passing value error");
        setShowLoading(true);
        const respose = await getApiRequest(`${process.env.REACT_APP_BASE_API}logout`,cookies.jwtfornotememo);
        if(respose.status === 200){

            setTimeout(()=>{
                setShowLoading(false);
                removeCookie("jwtfornotememo");
                navigate("/");
            },2000);
        }
    }

    async function fetchData(){
        setShowLoading(true);
        const [dataOne, dataTwo, dataThree] = await Promise.all(
            [
                getApiRequest(`${process.env.REACT_APP_BASE_API}user/profile`,cookies.jwtfornotememo),
                getApiRequest(`${process.env.REACT_APP_BASE_API}package/getPackages`,cookies.jwtfornotememo),
                getApiRequest(`${process.env.REACT_APP_BASE_API}purchase/getPurchaseRequest`,cookies.jwtfornotememo),
            ]
        );
       

        const [responseOne, responseTwo, responseThree] = await Promise.all(
            [
                dataOne.json(),
                dataTwo.json(),
                dataThree.json(),
            ]
        );
        setUserData(responseOne.message.userdata);
        setPackageList(responseTwo.packages);
        setRequestList(responseThree.dataList);
        setShowLoading(false);
        console.log("userData --", responseOne.message.userdata);
        console.log("packageList --",responseTwo.packages);
        console.log("requestList --",responseThree.dataList);
       
    }  

    async function deleteConfirm(){
        if(selectedPackage){
            setShowLoading(true);

            const result = await deleteApiRequest(
                `${process.env.REACT_APP_BASE_API}package/deletePackage`,
                cookies.jwtfornotememo,
                JSON.stringify({
                    packageId : selectedPackage._id
                }),
            );

            console.log("result after delete", result.status);
            setShowLoading(false);
            setShowConfirm(false);
            await DoneConfirm();

            setPaymentSuccess(true);
        }
    }

    function beforeConfirmDelete(item){
        setSelectedPackage(item);
        setShowConfirm(true);
    }

    function cancelConfirm(){
        setSelectedPackage(undefined);
        setShowConfirm(false);
    }

    async function DoneConfirm(){
        await fetchData();
        cancelConfirm();

    }
    
    useEffect(()=>{
        fetchData();
    },[])

    return (
        <>
            {
                showConfirm && <div
                className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div
                    className="bg-white rounded-md px-5 py-3 flex flex-col gap-5 justify-center items-center">
                        <p>Are you sure to delete this package?</p>
                        <div
                        className="flex flex-row justify-between items-center w-full">
                            <button
                            onClick={()=>cancelConfirm()}
                            className="text-lg text-cusblue">
                                Go back
                            </button>
                            <button
                            onClick={()=>deleteConfirm()}
                            className="bg-red-600 text-white rounded-md px-3 py-1">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                showCreatePackage && <div
                className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <CreatePackage
                     
                    userId={userData._id}
                    afterSubmitFunc={fetchData}
                    hide={()=>setShowCreatePackage(false)}/>
                </div>
            }
            {
                showPayment && <div
                className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <PaymentPopup 
                    onClose={()=>closePaymentFunc()}
                    onSubmit={(value)=>requestPackage(value)}/>
                </div>
            }
            {
                paymentSuccess && <div
                className="fixed z-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div
                    className="bg-white rounded-md px-5 py-3 flex flex-col gap-5 justify-center items-center">
                        <p>Your action success</p>
                        <button
                        onClick={()=>setPaymentSuccess(false)}
                        className="bg-cusblue rounded-md px-3 py-1">
                            Go back
                        </button>
                    </div>
                </div>
            }
            {
                showLoading 
                ? 
                <Loadingbox />
                :
                <>
                    <div
                        className="z-20 fixed top-5 left-10 right-10 text-black flex flex-row justify-between items-center">
                            <p
                            className="uppercase text-lg text-cuswood">{userData.userName}</p>
                            <button
                            className=""
                            onClick={()=>logoutFunc()}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket fa-2xl text-gray-700"></i>
                                <span
                                className="pl-2 text-base">Log out</span>
                            </button>
                    </div>
                    <div
                    className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                        {
                            packageList.length > 0 
                            ? 
                            <div
                            className="flex flex-row overflow-x-auto gap-7 px-8">
                                {
                                    packageList.map((item, index)=>(
                                        <div
                                        className="w-60 flex-shrink-0 flex flex-col justify-between items-center gap-5 py-7 px-3 rounded-lg shadow-lg bg-white"
                                        key={index}>
                                            <p
                                            className="text-cuswood text-lg font-bold uppercase text-center">{item.packageName}</p>
                                            <span
                                            className="bg-cuswoodlight text-black capitalize text-base px-3 py-1 rounded-md">{item.packageType}</span>
                                            <p
                                            className="text-cuswood text-lg font-bold text-center">Price - $ {item.price}</p>
                                            <p
                                            className="text-cusgreen text-base">{item.content}</p>
                                            <div>
                                                <span>Limit : </span>
                                                {
                                                    item.isUnlimited === true 
                                                    ?
                                                    <span 
                                                    className=" text-fuchsia-600 capitalize text-base px-3 py-1 rounded-md">Unlimited</span> 
                                                    :
                                                    <span
                                                    className="">
                                                        {item.limit}
                                                        <span
                                                        className="px-2 font-bold text-gray-700">{returnUnit(item.packageType)}</span>
                                                    </span>
                                                }
                                            </div>
                                            {
                                                userData.role === "user" 
                                                ? 
                                                <button
                                                onClick={()=>showPaymentFunc(item)}
                                                className="text-white bg-cusgreen capitalize text-base px-3 py-1 rounded-md">
                                                    Purchase
                                                </button>
                                                :
                                                <button
                                                onClick={()=>beforeConfirmDelete(item)}
                                                className="text-white bg-red-600 capitalize text-base px-3 py-1 rounded-md">
                                                    Delete
                                                </button>
                                            }
                                        </div>
                                    ))
                                }
                              
                            </div>
                            :
                            <div
                            className="w-screen h-screen flex justify-center items-center text-2xl">No package available</div>
                        }
                    </div>
                    {
                        userData.role === "admin" && <button
                        onClick={()=>{setShowCreatePackage(true)}}
                        className="fixed bottom-10 right-14 bg-cusblue text-white px-3 py-1 text-base rounded-md shadow-md">
                            Create Package
                        </button>
                    }
                </>
            }
        </>
    );
}