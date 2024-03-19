import { strictTransportSecurity } from 'helmet'
import { Timestamp } from 'mongodb'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    desc:{
        type:String,
        max:50,
        default:""
    },
    city:{
        type:String,
        max:50,
        default:""
    },
    from:{
        type:String,
        max:50,
        default:""
    },
    relationship:{
        type:Number,
        enum:[1,2,3],
        default:null
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})

export default mongoose.model("User",UserSchema);