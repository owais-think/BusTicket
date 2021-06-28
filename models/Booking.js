const mongoose = require('mongoose')

const StatusSchema=new mongoose.Schema({
    
    status:{type:String,default:"booked"},
    date:{
        type:Date,
        default:Date.now()
    }

})

const BookingSchema=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId , ref:'bususers'},
    busid:{type:mongoose.Schema.Types.ObjectId , ref:'busservices'},
    seatid:String,
    currentstatus:{type:String,default:"booked"},
    from:String,
    to:String,
    Status:[StatusSchema],     
    bookingDate:{
        type:Date,
        default:Date.now()
    }
})



module.exports=mongoose.model('bookings',BookingSchema)
