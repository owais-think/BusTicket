const mongoose = require('mongoose')

const SeatPlanSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"bususers"},
    seatnumber:Number,
    seatstatus:{type:String,default:"available"},
    bookingdate:Date,
    from:String,
    to:String
})

const BusServicesSchema = new mongoose.Schema({
    busname: String,
    class:String,
    price:Number,
    dayandtime:{type:Date},
    seatsbooked:{type:Number,default:0},
    from:String,
    stops:[String],
    seatplan:[SeatPlanSchema],
})

module.exports = mongoose.model('busservices', BusServicesSchema)