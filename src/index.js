import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";
import { ThemeProvider } from './customhooks/usethemehook';
// import RouteSwitch from './routeswitch';
import { RouterProvider } from 'react-router-dom';
import router from './routeswitch';
import ErrorHandler from './customhooks/errorhander';
import ShowLoadingScreen from './customhooks/showloadingscreen';
import AlertHandler from './customhooks/showalertbox';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if(process.env.NODE_ENV === "production")disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ThemeProvider>
      <ErrorHandler>
        <AlertHandler>
          <ShowLoadingScreen>
            <RouterProvider router={router}/>
          </ShowLoadingScreen>
        </AlertHandler>
      </ErrorHandler>
    </ThemeProvider>
  // </React.StrictMode>
);
