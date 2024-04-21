const Product = require("../model/Product");
const User = require("../model/User");
const {uploadImageToCloudinary} = require("../utils/ImageUploader");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category =  require("../model/Category");
const Profile = require("../model/Profile");


exports.createProduct = async(req,res)=>{
    try{
        const {productName , productDescription , price, tags,Categorys} = req.body;
        const category = JSON.parse(Categorys)
        console.log(category);

        const thumbnail = req.files.thumbnailImage;

        if(!productName || !productDescription || !price || !tags || !thumbnail || !category){
            return res.status(400).json({
                success:false,
                message:"All filelds are required",
            });
        }

        const userID = req.user.id;
        const sellerDetails = await User.findById(userID);
        // check seller id and user id is same or not 
        
        if(!sellerDetails){
            return res.status(404).json({
                success:false,
                message:"seller not found",
            });
        }

        // const tagDetail = await Tag.find({ _id: { $in: tags } });

        // if(!tagDetail){
        //     return res.status(404).json({
        //         success:false,
        //         message:"tagDetail not found",
        //     });
        // }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const newProduct = await Product.create({
            productName,
            productDescription,
            seller : sellerDetails._id,
            price,
            tags:tags,
            thumbnail:thumbnailImage.url,
            category:category._id,
        });
    //    const categoryObjectId =new mongoose.Types.ObjectId(Category);


        await User.findByIdAndUpdate({_id:sellerDetails._id},{$push:{products:newProduct._id}},{new:true});
        console.log("printing cat id ",category._id);
        await Category.findByIdAndUpdate({_id:category._id },{$push:{products:newProduct._id}},{new:true});

        return res.status(200).json({
            success:true,
            message:"product created successfully",
            data:newProduct,
        });
        next();

        
    }
    catch(err){
        console.log("error while creating product",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
} 

exports.showAllProducts = async(req,res)=>{
    try{
        // changes in the future 
        const allProducts = await Product.find({});

        return res.status(200).json({
            success:true,
            message:"Displaying all product",
            data:allProducts,
        })
    }
    catch(err){
        console.log("error while displaying all product",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


exports.getProductDetails= async(req,res)=>{
    try{
        const {productId} = req.body;
        console.log(productId)
        const productDetails = await Product.find(
            {_id:productId})
            .populate(
            {
            path:"seller",
            populate:{
                path:"additionalDetail",
            }
            })
            .populate(
                {
                    path:"category",
                    populate:{
                        path:"products",
                    }
                })
            .populate("ratingAndReviews")
            .exec();

            console.log(productDetails);
            if(!productDetails){
                console.log("could not find thre course with this id",err);
                return res.status(400).json({
                    success:false,
                    message:err.message,
                });
            }

            return res.status(200).json({
                success:true,
                message:"Product detail fetched successfully",
                productDetails
            });
    }
    catch(err){
        console.log("error while fetching all product",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.getsellerproduct = async(req,res)=>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found ",
            });
        }

       
        const response = jwt.verify(token,process.env.JWT_SECRETE);
        console.log("unwrap token in as ",response);
        const email = response.email;

        const user = await User.findOne({email:email});
        console.log("fetch pr",user);   

        if(!user){
            return res.status(403).json({
                success:false,
                message:"user not exist",
            });
        }

        const selectedProduct = await User.findById(user._id).populate("products").exec();
        console.log("in gesfa",selectedProduct);

        if(!selectedProduct){
            return res.status(400).json({
                success:false,
                message:"producrs not found",
            });
        }

        return res.status(200).json({
            success:true,
            pass:{selectedProduct}
        })


        }
    catch(err){
        console.log("error while fetching user product",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }   
}
// exports.deleteProduct = async (req, res) => {
//     try {
//         const { productId, categoryId, userId } = req.body;

//         let existingUser = await User.findOne({ _id: userId });
//         let existingCategory = await Category.findById({ _id: categoryId });
//         if (!existingUser) {
//             return res.status(401).json({
//                 status: "401-USER",
//             });
//         }
//         await User.updateMany(
//             { cartProduct: productId },
//             { $pull: { cartProduct: productId } }
//         );

//         existingUser.products = existingUser.products.filter(product => product.toString() !== productId);
//         existingUser.cartProduct = existingUser.cartProduct.filter(product => product.toString() !== productId);
        
//         if(existingCategory){
//             existingCategory.products = existingCategory.products.filter(product => product.toString() !== productId);
//             await existingCategory.save();
//         }
//         await existingUser.save();

     
//         await Product.deleteOne({ _id: productId });

//         res.status(200).json({
//             status: true,
//             message:"Product deleted successfully",
//         });
//     } catch (err) {
//         res.status(400).json({
//             status:false,
//             message: err.message,
//         });
//     }
// };

exports.deleteProduct = async (req, res) => {
    try {
        const { productId, categoryId, userId } = req.body;

        if(!productId || !categoryId || !userId){
            return res.status(401).json({
                status: false,
                message:"all field are required while deleting product",
            });
        }

        let existingUser = await User.findOne({ _id: userId });
        let existingCategory = await Category.findById({ _id: categoryId });
        if (!existingUser) {
            return res.status(401).json({
                status: false,
                message:"401 User"
            });
        }
        
        await User.updateMany(
            { cartProduct: productId },
            { $pull: { cartProduct: productId } }
        );

        await User.updateOne(
            { _id: userId },
            { $pull: { products: productId } }
        );
        
        if (existingCategory) {
            await Category.updateOne(
                { _id: categoryId },
                { $pull: { products: productId } }
            );
        }

        await Product.deleteOne({ _id: productId });

        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message,
        });
    }
};

exports.displayMyProduct = async(req,res)=>{
    try{
        const {userId} = req.body;

        if(!userId){
            console.log("not userId in display my product");
            res.status(400).json({
                status: false,
                message: err.message,
            });
        }

        const user = await User.findOne({_id:userId}).populate("products").exec();
        const product = user.products;
        if(product){
            res.status(200).json({
                status: true,
                message: "product fetch successfully",
                products:product,
            });
        }
    }
    catch(err){
        res.status(400).json({
            status: false,
            message: err.message,
        });
    }
}

exports.editProduct = async (req, res) => {
    try {
        const { productName, productDescription, price,productId } = req.body;
        let thumbnail = null;
        if(req.files){
            thumbnail = req.files.image;
       }

       console.log(thumbnail,"fdsf");
        
       let thumbnailImage = {};
       if(thumbnail){
           thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
          }
        // Update only the specified fields using $set
        const updatedFields = {};
        if (productName) updatedFields.productName = productName;
        if (productDescription) updatedFields.productDescription = productDescription;
        if (price) updatedFields.price = price;
        if(thumbnailImage) updatedFields.thumbnail = thumbnailImage.url;

        
       
        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updatedFields }, { new: true });
        console.log(updatedProduct);
        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            success:true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        console.error("Error editing product:", err);
        res.status(500).json({
            success:false,
            message: "Internal server error"
        });
    }
};
