import { useCookies } from "react-cookie";
import {useRef, useState} from "react";
import { postApiRequest } from "../../utils/apiRequests";

export default function CreatePackage({
    userId,
    afterSubmitFunc,
    hide,
}){
    const [cookies] = useCookies(["jwtforlifememory"]);
    const packageName = useRef();
    const packageType = useRef();
    const content = useRef();
    const limit = useRef();
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [showLoading, setShowLoading] = useState(false);


    const handleSubmit = async(e) => {
        e.preventDefault();
        setShowLoading(true);
        const newPackage ={
            packageName: packageName.current.value,
            packageType: packageType.current.value,
            content: content.current.value,
            limit: limit.current.value,
            isUnlimited : isUnlimited,
            createdBy: userId,
        };

        // console.log("Submitted Package:", newPackage);
        const response = await postApiRequest(
            `${process.env.REACT_APP_BASE_API}package/createPackage`,
            cookies.jwtforlifememory,
            JSON.stringify({
                packageName: packageName.current.value,
                packageType: packageType.current.value,
                content: content.current.value,
                limit: limit.current.value,
                isUnlimited : isUnlimited,
                createdBy: userId,
            }),
        );

        console.log("response after create", response);

        // Call the afterSubmitFunc if provided
        // if (afterSubmitFunc) {
        //     afterSubmitFunc(newPackage);
        // }

        // Reset form fields after submission
        packageName.current.value = '';
        packageType.current.value = 'post'; // Reset to default
        content.current.value = '';
        limit.current.value = '';
        setIsUnlimited(false); // Reset checkbox
        setShowLoading(false);
        hide();
        afterSubmitFunc();
    };

    return (
        <div
        className="relative">
            <button
            onClick={()=>hide()}>
            <i className="fa-solid fa-xmark fa-2xl text-black"></i>
            </button>
            <form onSubmit={handleSubmit} className="space-y-4 bg-blue-100 w-80 px-5 py-4 rounded-md shadow-lg">
            <div>
                <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">Package Name</label>
                <input
                    type="text"
                    ref={packageName}
                    id="packageName"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>

            <div>
                <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">Package Type</label>
                <select
                    ref={packageType}
                    id="packageType"
                    defaultValue="post"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <option value="voice">Voice</option>
                    <option value="video">Video</option>
                    <option value="post">Post</option>
                </select>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    ref={content}
                    id="content"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                ></textarea>
            </div>

            <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700">Limit</label>
                <input
                    type="number"
                    ref={limit}
                    id="limit"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isUnlimited"
                    checked={isUnlimited}
                    onChange={() => setIsUnlimited(!isUnlimited)}
                    className="mr-2"
                />
                <label htmlFor="isUnlimited" className="text-sm font-medium text-gray-700">Is Unlimited</label>
            </div>

            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Create Package
            </button>
        </form>
        </div>
    );
}