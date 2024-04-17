const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    address:{
        type:String,
    },
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
    },
    contactNo:{
        type:Number,
        trim:true,
    }


});

module.exports = mongoose.model("Profile",profileSchema);