const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    address:{
        type:String,
    },
    gender:{
        type:String,
    },
    dataOfBirth:{
        type:String,
    },
    about:{
        type:String,
    },
    contactNumber:{
        type:Number,
        trim:true,
    }


});

module.exports = mongoose.model("Profile",profileSchema);