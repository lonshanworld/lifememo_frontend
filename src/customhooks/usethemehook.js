import React, {useContext, useEffect, useState} from "react";
import "../styles/index.css";

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

function useTheme(){
    // console.log("This is inside use theme");
    return useContext(ThemeContext);
}

function useThemeUpdate(){
    // console.log("This is inside theme update");
    return useContext(ThemeUpdateContext);
}

function ThemeProvider({children}){
    const [darkTheme, setDarkTheme] = useState(false);

    function toggleTheme(){
        // console.log("Toggle theme color");
        setDarkTheme(prev => !prev);
    }

    useEffect(()=>{
        if(darkTheme){
            document.documentElement.style.setProperty("--varbackground", "black");
            document.documentElement.style.setProperty("--vartext", "white");
            document.documentElement.style.setProperty("--vartextopposite", "#333333");
            document.documentElement.style.setProperty("--varshadowClr","#030712");
        }else{
            document.documentElement.style.setProperty("--varbackground", "#F6F6F6");
            document.documentElement.style.setProperty("--vartext", "black");
            document.documentElement.style.setProperty("--vartextopposite", "white");
            document.documentElement.style.setProperty("--varshadowClr","grey");
        }
    },[darkTheme]);

    return (
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    );
}

export {ThemeProvider, useTheme, useThemeUpdate};