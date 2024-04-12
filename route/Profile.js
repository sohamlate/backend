const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth");
const {deleteProfile,updateProfile,getUserAllData} = require("../controller/Profile");

router.delete("/deleteProfile",deleteProfile);
router.put("/updateProfile",updateProfile);
router.get("/getUserData",getUserAllData);
// purchase_product update_display_pictures  
module.exports = router


