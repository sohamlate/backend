const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
    },
    accountType:{
        type:String,
        enum:["Seller","Admin","Customer"],
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    additionalDetail:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        }
    ],
    image:{
        type:String,
        required:true,
    },
    isnew:{
        type:Boolean,
        default:false,
    },
    cartProduct:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        }
    ]




});

module.exports = mongoose.model("User",userSchema);