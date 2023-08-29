import React from "react";
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
// import Button /from '@mui/material/Button';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import {io} from "socket.io-client";
// import  TextField  from '@mui/material/TextField';
import Box from '@mui/material/Box'
// import  Container from '@mui/material/Container';
import  Typography  from '@mui/material/Typography';
import  OutlinedInput  from '@mui/material/OutlinedInput';
import  InputAdornment  from '@mui/material/InputAdornment';
import  IconButton  from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Card from '@mui/material/Card';
// import shadows from "@mui/material/styles/shadows";
import  InputLabel  from "@mui/material/InputLabel";
import { useOutletContext, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import '../Styles/Button.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useRef } from "react";
export default function ChatWindow(){
    const {socket} = useOutletContext();

    const [message, setMessage] = useState("");
  
    const [chat, setChat] = useState([]);

    const [typing, setTyping] = useState(false);

    const [typingTimeOut, SetTypingTimeOut] = useState(null);


    const {roomId} = useParams();
    const navigate = useNavigate();

    const fileRef  = useRef();

      useEffect(()=>{
       if(!socket){
        return;
       }
       socket.on('message-from-server',(data)=>{
        setChat((prev)=>[...prev, {message:data.message, received:true}]);
        // console.log(setChat);
        // console.log('message fron m server', data)
       });

       socket.on('typing-started-from-server',()=>{
        setTyping(true);
       });

       socket.on('typing-stopped-from-server',()=>{
            setTyping(false);
       })

       socket.on("uploaded",(data)=>{
        // console.log(data);
            setChat((prev)=>[
                ...prev,
                {message: data.buffer, received: true, type:'image'}
            ]); 
       })

      },[socket]);
    
      function selectFile(){
        fileRef.current.click();
      }

      function fileSelected(e){
        
        const file = e.target.files[0];
        if(!file){
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=>{
            const data = reader.result;
            socket.emit('upload', {data, roomId}); 
            setChat((prev)=>[
                ...prev,
                {message:reader.result, received: false, type:'image'}
            ])
        };
        // console.log(e.target.files);
      }

      function handleForm(e){
        e.preventDefault();
        // console.log(message);
        socket.emit('send-message', {message, roomId});
        setChat((prev)=>[...prev, {message, received:false}]);
        setMessage("");
      }

      function handleInput(e){
        setMessage(e.target.value);
        socket.emit("typing-started-from-user", {roomId});
        console.log("rommId=",roomId)
        if(typingTimeOut){
            clearTimeout(typingTimeOut);
        }
        SetTypingTimeOut(()=>{
            setTimeout(()=>{
                socket.emit("typing-stopped-from-user", {roomId});
            }, 2000);
            // console.log('stop');
        });
      }

      async function removeRoom(){
        
        socket.emit("room-removed-from-user", {roomId});
        navigate("/");
      }

    return(
        <>
        <Box sx={{display:"flex", justifyContent:"center", width:"100%"}}>
            <Card sx={{padding:2, marginTop:10, width:'60%', boxShadow:20, color:"white",
            background: "linear-gradient(to right, rgba(102,126,234,1), rgba(118,75,162,1))"
        }}>
            <Box sx={{display:"flex", justifyContent:"space-between"}}>
            {
            roomId && <Typography>Room: {roomId}</Typography>
        }
        {
            roomId && <Button className='button-87' size='small' onClick={removeRoom}>Delete</Button>
        }
        </Box>
                <Box sx={{marginBottom:5, padding:2}}>
                {chat.map((data)=>(
                    
                    data.type === 'image'?( <img 
                    style = {{float: data.received? 'left': "right",  marginLeft: data.received?"1%": "100%", marginRight: data.received?"100%": "1%"}} 
                    src={data.message}  alt='error' width="45%"/>
                    
                    ):(
                    <Typography sx = {{textAlign: data.received? 'left': "right"}} style={{float:'bottom'}}  key={data.message}>{data.message}</Typography>)
                ))}
                </Box>
                <Box component="form" onSubmit={handleForm}>
                    {
                    
                         typing &&  <InputLabel sx={{color:"white"}} shrink htmlFor="message-input" >
                        Typing...
                    </InputLabel>
                    }
                    {/* <TextField 
                    id="standard-basic" 
                    label="Name" 
                    variant="standard"
                    size="small"
                    value = {message}
                    onChange={(e)=>setMessage(e.target.value)}
                    ></TextField> */}
                    {/* <br></br> */}
                <OutlinedInput
                    // id="outlined-adornment-password"
                    sx={{backgroundColor:"White", width:"100%", input:{textAlign:"right "}}}
                    size="small"
                    value={message}
                    label="chat"
                    placeholder="Chat"
                    id="message-input"
                    // onChange={(e)=>setMessage(e.target.value)}
                    onChange={handleInput}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        label="Chat"
                        color="primary"
                        type="submit"
                        edge="end"
                        marginright="4px"
                        onClick={selectFile}
                        >
                        
                        <AttachFileIcon/>
                        <input onChange={fileSelected} ref={fileRef} type="file" style={{display:"none "}}></input>
                        </IconButton>

                        <IconButton
                        label="Chat"
                        color="primary"
                        type="submit"
                        edge="end"
                        >
                        
                        <SendIcon/>
                        
                        </IconButton>
                    </InputAdornment>
                    }
                    
                />
                    {/* <Button variant="text" type="submit">SUBMIT</Button> */}

                </Box>
            </Card>
          </Box>
          </>

    )
}