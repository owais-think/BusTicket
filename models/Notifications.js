const mongoose=require('mongoose')
const NotificationSchema=new mongoose.Schema({
    
    userid:String,
    busid:String,
    seatid:String,
    notification:String,
    dateandtime:{type:Date,default:Date.now()}

})
 module.exports=mongoose.model('notifications',NotificationSchema)