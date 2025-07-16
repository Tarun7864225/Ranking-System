import express from "express";
import User from "../Schema/user.js";

const router = express.Router();

//Adding New User
router.post('/addUser',async(req,res)=>{
    try {
        const {userName} = req.body;
        if(!userName) return res.status(400).json({success:false,message:"Error :  User Name"})
        await User.create({userName})
        return res.status(200).json({success:true,message:"New User Created"})
        } catch (error) {
        console.log("ERROR:",error)
        res.status(400).json({success:false,message:"Error Creating New User"})
    }
})

//Rank List
router.get('/rankList',async(req,res)=>{
    try {
        const users = await User.find().sort({userPoints:-1});
        return res.status(200).json({ count:users.length , data:users});
    } catch (error) {
        console.log("ERROR:",error)
        res.status(400).json({success:false,message:"Error Fetching Users"})       
    }
})

export default router;