const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = ()=>{
    try{
    console.log("Start working line ",process.env.MONGODB_URL);
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{console.log("db connected successfuly")})
    .catch((err)=>{
        console.error(err);
        process.exit(1);
    });    
}
catch(err){
    console.log("database connection problem ");
}

}