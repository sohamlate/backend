const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = async() =>{
    
    console.log("Start working line ",process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{console.log("db connected successfuly")})
    .catch((err)=>{
        console.error(err);
        process.exit(1);
    });    


}