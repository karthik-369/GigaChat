
import  Container  from '@mui/material/Container';
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
// import { Typography } from '@mui/material';
import {Box} from "@mui/material";
import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import Cookies from 'js-cookies';
function App() {
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  useEffect(()=>{
      setSocket(io("http://localhost:5000"));
      const _userId = Cookies.getItem('userId');
      if(_userId){
        
        setUserId(_userId);
      }
    },[])



  return (
    <div>
        <Container>
          <Header socket={socket} userId ={userId} setUserId={setUserId}/>
        <Box
          sx={{
            display: 'flex',
            // flexDirection: 'column',
            // minHeight: '100vh',
            // width:"100%",
            justifyContent: 'center',
          }}
        >
          
          <Outlet context={{socket, userId}}/>
          {/* <ChatWindow/> */}
        </Box>
        </Container>
    </div>
  );
}

export default App;
