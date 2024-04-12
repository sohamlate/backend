const express = require("express");
const router = express.Router();

const {createProduct,getProductDetails,showAllProducts,getsellerproduct,deleteProduct,displayMyProduct} = require("../controller/Product");
const {createCategory,showAllCategory,categoryDetails,getid} = require("../controller/Category");
const {createRating,getAllRatings,getAverageRating} = require("../controller/RatingAndReview");
const {addToCart,removeFromCart,displayCartItem} = require("../controller/CartItem");
const {auth, isAdmin,isCustomer,isSeller} = require("../middleware/auth");


router.post("/createproduct",auth,isSeller,createProduct);
router.get("/getsellerproduct",getsellerproduct);
router.get("/getallproduct",showAllProducts);
router.post("/getproductdetail",getProductDetails);
router.post("/deleteproduct",deleteProduct);

router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/getCategoryDetail",showAllCategory);
router.post("/getCategoryPageDetail",categoryDetails);
router.post("/getCategoryid",getid);

router.post("/createRating",auth,isCustomer,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReview",getAllRatings);

router.post("/addtocart",addToCart);
router.post("/removeFromCart",removeFromCart);
router.post("/displayCartItem",displayCartItem);

router.post("/displayMyProduct",displayMyProduct);

module.exports = router;



