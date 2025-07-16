import mongoose from "mongoose";
import { nanoid } from "nanoid";

const users = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        default:()=>nanoid(10)
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    }, 
    userPoints:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const User = mongoose.model('system',users)

export default User;