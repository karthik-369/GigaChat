import React,{useEffect} from "react";
import {Routes, Route, useParams} from 'react-router-dom';
import {io} from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import ChatWindow from "../Components/ChatWindow";
import { Card, Typography, Box } from "@mui/material";

export default function Room(){
    const params = useParams();

    const {socket} = useOutletContext();


    
    useEffect(() => {
        if(!socket){
            return;
        }
        socket.emit('join-room', {roomId: params.roomId});
        console.log(params);
        console.log('from room page');
    },[socket]);
    return(
        <>
        {/* <Typography> Room: {params.roomId}</Typography> */}

       
        
        <ChatWindow/>
        
        </>
    )
}