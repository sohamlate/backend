const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    
    productName:{
        type:String
    },
    productDescription:{
        type:String
    },
    // productImage:{
    //     type:String,
    // },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    ratingAndReviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ratings"
    },
    price:{
        type:Number,  
    },
    thumbnail:{
        type: String,
    },
    tags:{
        type:[String],
        required:true,
      
    },
    // Product:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Product",
    // },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    customerPurchase:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,  
            ref:"User"   
        }
    ],
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    },


});

module.exports = mongoose.model("Product",productSchema);  