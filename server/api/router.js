import Room from '../models/rooms.js'
import {Router} from 'express'
const router = new Router()
router.get("/rooms", async(req, res)=>{
    const rooms = await Room.find();
    res.json({rooms}); 
});



export default router;