const Profile = require("../model/Profile");
const User = require("../model/User");

exports.updateProfile = async(req,res)=>{
   try{
        const {gender ,dateOfBirth , about , contactNo } = req.body;

        const id = req.user.id;

        if(!gender || !dateOfBirth || !about || !contactNo){
            return res.status(403).json({
                success:false,
                messsage:"All fields are required ",
            });
        }

        const userDetail = await User.findById(id);
        const profileId = userDetail.additionalDetail;
        const profileDetail = await Profile.findById(profileId);

        profileDetail.gender = gender ;
        profileDetail.dateOfBirth = dateOfBirth;
        profileDetail.about = about;
        profileDetail.contactNo = contactNo;

        await profileDetail.save();

        return res.status(200).json({
            success:true,
            message:"Additional info added ",
        });
   }
   catch(err){
    console.log("error occured while addind extra info",err);
    return res.status(500).json({
        success:false,
        message:err.message,
    });
   }
}


exports.deleteProfile = async(req,res)=>{
   try{
        const userId = req.user.id;

        const userDetail = await User.findById(userId);

        if(!userDetail){
            return res.status(403).json({
                success:false,
                message:"User required",
            })
        }

        await Profile.findByIdAndDelete({_id:userDetail});
        await User.findByIdAndDelete({_id:userId});

        return res.status(200).json({
            success:true,
            message:"Profile deleted successfully",
        })
   }
   catch(err){
       console.log("Error occured while deleting the profile",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
   }
}

exports.getUserAllData = async(req,res)=>{
    try{
        const userId1 = req.user.id;

        const userDetail = await User.findById(userId1).populate("additionalDetail")

        return res.status(200).json({
            success:true,
            message:"User all detail get successsfully",
        })
    }
    catch(err){
        console.log("error occured while getting all user data",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}