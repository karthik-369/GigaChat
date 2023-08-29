import { createBrowserRouter } from "react-router-dom";
import App from "./App";
// import ChatWindow from "./Components/ChatWindow";
import Home from "./Pages/Home";
// import Chats from "./Pages/Chats.js";
import Room from "./Pages/Room";
const router = createBrowserRouter([
    {
        path: "/",
        
        element: <App/>,
        children:[
            {
                path:"/",
                element:<Home/>,
            },
            // {
            //     path:"/chats",
            //     element:<Chats />,
            // },
            {
                path:"room/:roomId",
                element:<Room/>,
            },
        ]
    },
]);

export default router;