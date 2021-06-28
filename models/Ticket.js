const mongoose=require('mongoose')
const TicketSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"bususers"},
    busdetails:{type:mongoose.Schema.Types.ObjectId,ref:"busservices"},
    seatno:Number
})

module.exports=mongoose.model('tickets',TicketSchema)