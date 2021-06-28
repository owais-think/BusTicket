const express=require('express')
const Booking = require('../models/Booking')
const Notifications=require('../models/Notifications')
const Busservice=require('../models/BusServices')
const Ticket = require('../models/Ticket')
const router=express()
router.post('/createbooking',(req,res)=>{
    let bookingdata={
        user:req.body.userid,
        busid:req.body.busid,
        from:req.body.from,
        to:req.body.to
    }
    let seatdata={
        seatid:req.body.seatid,
        seatnumber:req.body.seatnumber,
        seatstatus:req.body.seatstatus,
        bookingdate:req.body.bookingdate,
        user:req.body.userid,
        from:req.body.from,
        to:req.body.to
    }
    let ticketdata={
        user:req.body.userid,
        busdetails:req.body.busid,
        seatno:req.body.seatnumber
    }
    
    Booking.create(bookingdata,(err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            let notificationn={
                userid:req.body.id,
                busid:req.body.busid,
                seatid:req.body.seatid,
                notification:"Booking Done"
            }
            Notifications.create(notificationn,(err,not)=>{
                if(err){
                    return res.json({message:"Failed",err})
                }
                else{
                    Busservice.findOneAndUpdate({"_id":bookingdata.busid,"seatplan._id":seatdata.seatid},{"$set":{"seatplan.$.seatnumber":seatdata.seatnumber,"seatplan.$.seatstatus":seatdata.seatstatus,"seatplan.$.user":seatdata.user,"seatplan.$.from":seatdata.from,"seatplan.$.to":seatdata.to,"seatplan.$.bookingdate":seatdata.bookingdate}},{new:true})
                    .populate('seatplan.user',"name")
                    .exec((err,doc)=>{
                    
                        if(err){
                            return res.json({message:"Failed",err})
                        }
                        else{
                            // return res.json({message:"Success",doc})
                            
                            Ticket.create(ticketdata,(er,tic)=>{
                                if(err){
                                    return res.json({message:"Failed",er})
                                }
                                else{
                                    Busservice.findOneAndUpdate({"_id":bookingdata.busid},{$inc:{seatsbooked:1}},{new:true},(err,bb)=>{
                                        if(er){
                                            return res.json({message:"Failed",er})
                                        }
                                        else{
                                            return res.json({message:"Success",bb})
                                        }
                                    })
                                    // return res.json({message:"Success",doc})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

router.get('/viewbooking',(req,res)=>{
    Booking.find((err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",data})
        }
    })

})
module.exports=router
