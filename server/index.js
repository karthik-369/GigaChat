// const express = require('express');
// const http = require('http');
// const {Server} = require('socket.io')

import router from './api/router.js'
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
const app = express()
const httpServer = http.createServer(app);
const port = 5000

import  sockets  from './socket/routes.js'



const io = new Server(httpServer,{
    cors:{
        origin: ['http://localhost:3000']
    }
});



await mongoose.connect("mongodb+srv://tracey:tracey369@cluster0.pej4rb2.mongodb.net/?retryWrites=true&w=majority");
app.use(cors());
app.get('/',(req, res)=>{
    res.sendFile(__dirname +"/index.html");
});
app.use("/",router);
// const {fileURLToPath} = require('url');
//  __filename = fileURLToPath(import.meta.url)
//  __dirname = path.dirname(__filename);


 



io.on('connection', sockets);



httpServer.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})