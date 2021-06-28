const express=require('express')
const BusServices = require('../models/BusServices')
const router=express()
const Ticket=require('../models/Ticket')

router.get('/viewmyticket',(req,res)=>{
    Ticket.findOne({user:req.body.userid})
    .populate('user',"name")
    .populate('busdetails',`busname dayandtime from`)
    .exec((err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else
        {  
            return res.json({message:"Success",data});
            
        }

    })      
})
module.exports=router;