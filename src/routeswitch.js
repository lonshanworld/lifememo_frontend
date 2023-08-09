import React, { useState } from "react";
import { createBrowserRouter} from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import Signup from "./pages/signup";
import MainScreen from "./pages/mainscreen";
import NoRoute from "./pages/noRoute";
import CookieChecker from "./customhooks/usecookiehook";
import Postdetail from "./pages/postdetail";
import ProfileScreen from "./pages/profilescreen";
import CreatePostScreen from "./pages/createpostscreen";
import SearchScreen from "./pages/searchscreen";
import UpdateProfileScreen from "./pages/updateprofilescreen";

// function RouteSwitch(){

//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<App/>} errorElement={<NoRoute/>}/>
//                 <Route path="/login" element={<Login/>} />
//                 <Route path="/signup" element={<Signup/>} />
//                 <Route path="/main" element={<MainScreen/>} />
//             </Routes>
//         </BrowserRouter>
//     );
// }

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NoRoute/>,
        caseSensitive:true,
    },
    {
        path:"login",
        element: <Login/>,
        caseSensitive:true,
    },
    {
        path:"signup",
        element: <Signup/>,
        caseSensitive:true,
    },
    {
        path:"main",
        element: <CookieChecker><MainScreen/></CookieChecker>,
        caseSensitive:true,
    },
    {
        path:"postdetail/:postId/:userId/:accountId",
        element: <CookieChecker><Postdetail/></CookieChecker>,
        caseSensitive:true,
    },
    {
        path:"profile/:accountId/:userId",
        element: <CookieChecker><ProfileScreen/></CookieChecker>,
        caseSensitive:true,
    },
    {
        path:"createpost/:userId",
        element: <CookieChecker><CreatePostScreen/></CookieChecker>,
        caseSensitive:true,
    },
    {
        path: "search/:userId",
        element : <CookieChecker><SearchScreen/></CookieChecker>,
        caseSensitive: true,
    },
    {
        path: "updateprofile/:userId",
        element : <CookieChecker><UpdateProfileScreen/></CookieChecker>,
        caseSensitive: true,
    },
]);

export default router;