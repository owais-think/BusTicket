const mongoose=require('mongoose')
const UserOtpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otpcode:Number
})

module.exports=mongoose.model('userotp',UserOtpSchema)