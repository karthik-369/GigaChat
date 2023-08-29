import React from 'react';
import  Card  from '@mui/material/Card' ;
import Button from '@mui/material/Button';
import {Link, useNavigate} from "react-router-dom";
// import  Typography from '@mui/material/Typography';
import {v4 as uuidv4} from 'uuid'; 
import Box from '@mui/material/Box';
// import { useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookies';
export default function Header({socket, userId, setUserId}){
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    // const {socket} = useOutletContext();
    function createNewRoom(){
        // console.log("new room ");
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
        socket.emit('new-room-created',{ roomId, userId });
        // setRooms([...rooms, {roomId, name:'Test', _id:"testId"}]);
    }

    function login(){
        const userId = uuidv4();
        setUserId(userId);
        Cookies.setItem('userId',userId);
        navigate("/")
        console.log("rooms");
        console.log(rooms);
        console.log('rooms');
    }

    function logout(){
        setUserId(null);
        Cookies.removeItem('userId');
        navigate("/");
    }

    useEffect(()=>{
        async function fetchRooms(){
            const res = await fetch('http://localhost:5000/rooms');
            const {rooms} = await res.json();
            setRooms(rooms);
        }
        fetchRooms();
    },[]);


    useEffect(() => {
        if(!socket){
            return;
        }
        socket.on('new-room-created', ({roomId})=>{
            setRooms([...rooms,roomId]);
        });

        socket.on('room-removed-from-server', ({roomId})=>{
            setRooms(rooms.filter((room)=>room.roomId !== roomId));
        })

    },[socket]);
    return(
        <Card
        sx={{ marginTop: 5, width:'100%', padding:'10px', boxShadow:"10px",
        backgroundImage: "linear-gradient(to right, #14ffee, #00feca, #48fb9b, #7af564, #a8eb12)"
        }} raised 
        >
                <Box sx={{display:'flex', justifyContent:"space-between"}}>
                    <Box >
                    <Link style={{textDecoration:"none"}} to="/">
                        <Button variant='text' sx={{color:"black"}}>
                            Home
                        </Button>
                    </Link>
                    { 
                        rooms.map((room)=>(
                        <Link key={room._id} style={{textDecoration:"none"}} to={`/room/${room.roomId}`}>
                            <Button variant='text' sx={{color:"black"}} >   room</Button>
                        </Link>
                        ))
                    }
                    </Box>
                    {/* <Link style={{textDecoration:"none"}} to="/chats">    
                        <Button variant='text' sx={{color:"black"}}>   Chats</Button>
                    </Link> */}
                   
                    <Box>
                    {
                            userId && (
                                <Box>
                            <Button sx={{color:"black"}} variant='text' onClick={createNewRoom}>
                            New Room
                            </Button>
                                <Button sx={{color:"black"}} variant='text' onClick={logout} >
                                Logout
                            </Button>
                            </Box>
                            )
                        }                   
                        {
                            !userId && (
                                <Button sx={{color:"black"}} variant='text' onClick={login} >
                                    Login
                                </Button>
                            )
                        }
                        
                        
                        
                    </Box>
                    </Box>
        </Card>
    )
}