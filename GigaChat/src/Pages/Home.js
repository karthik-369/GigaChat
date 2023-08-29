import { Typography } from "@mui/material";
import React from "react";
import {Card} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import '../App.css'
import Cat from '../Components/Cat';
// var temp = require("../bongo-cat-codes-2jamming/dist/index.html");

export default function Home(){

    const {socket} = useOutletContext();
    console.log(socket);
    return(
        <>
        <div>
            <Card sx={{  textAlign:"center", marginTop:5, padding:"20px", flex:"top"}}>
                <Typography >Welcome to GigaChat</Typography>
            </Card>

            
         </div>
        
        <div>
        kjhj
        <Cat sx={{width:"100%", height:"100%"}}/>
        </div>
        </>
    )
}