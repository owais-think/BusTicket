const mongoose=require('mongoose')
const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt')
const {Auth,LoginCredentials}=require('two-step-auth')
const Otp=require('../models/Otp')
const checkauthorization=require('../checkauthorization')
const Users=require('../models/Users');
const fs=require('fs');
const BusServices = require('../models/BusServices');
const Notifications = require('../models/Notifications');

//get all user
router.get('/viewusers',(req,res)=>{
    Users.find((err,doc)=>{
    if(err){
        return res.json({message:"Failed",err})
    }
    else{
        return res.json({message:"Success",doc})
    }
    })
})



//user signup
router.post('/createuser',(req,res)=>{
            
                let otpno=Math.floor(100000 + Math.random() * 900000)
                console.log(otpno)

                let otp={
                    email:req.body.email,
                    otpcode:otpno
                }
                let data={
                    email:req.body.email,
                    name:req.body.name,
                    phnumber:req.body.phnumber,
                    password:req.body.password
                }
                Otp.create(otp,(err,doc)=>{
                    if(err){
                        return res.json({message:"Failed",err})
                    }
                    else{
                        Users.create(data,(err,docc)=>{
                            if(err){
                                return res.json({message:"Failed",err})
                            }
                            else{
                                return res.json({message:"Successfull",docc})
                            }
                        })
                    }
                })      
    })
 
//Delete User
router.delete('/deleteuser',(req,res)=>{
    const id=req.body.id;
    const deletespecific=Users.findByIdAndDelete(id)
    res.json(deletespecific)
})

//View otp
router.get('/viewotpcodes',(req,res)=>{
    Otp.find((err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",doc})
        }
    })
})

//Verify otp and update users array
router.put('/verify',(req,res)=>{
    console.log('body->',req.body)
    if(req.body.email!==undefined && req.body.otpnumber!==undefined)
    {
        Otp.findOne({email:req.body.email,otpcode:req.body.otpnumber},(err,doc)=>{
            if(err) return res.json({message:"Failed",err})
            else
            {
                if(doc!==null)
                {
                   // const updatespecific= User.updateOne({email:req.body.email},{$set:{Authorize:{$eq:true}}})
                    //res.json(updatespecific)
                    Users.findOneAndUpdate({email:req.body.email},{Authorize:true},{new:true},(error,user)=>{
                        if(error)return res.json({message:"Failed",error})
                        else{
                            return res.json({messageL:"success",otp:doc,user:user})
                        }
                    })
                }
                else
                {
                    return res.json("Invalid OTP or email")
                }
            }
        })
    }
    else
    {
        return res.json({message:"Failed",Error:"OTP and Email are required"})
    }
})

//add address route
// router.put('/insertaddress',(req,res)=>{
//     let emaill=req.body.email;
//     let address=req.body.address;

//     Users.findOneAndUpdate({email:emaill},{"$push":{address:address}},{new:true},(err,doc)=>{
//         if(err)
//         {
//             return res.json({message:"Failed"},err)
//         }
//         else
//         {
//             if(doc!==null)
//             {
//                 return res.json({message:"Adress Inserted",doc})
//             }
//         }
//     })
// })

router.get('/login',checkauthorization,(req,res)=>{
    
            return res.json({
                doc:req.doc,
                token:req.token
         
    })
    
    
})

router.get('/filter',(req,res)=>{
    BusServices.find({$and:[{class:req.body.class},{$and:[{price:{$gt:req.body.price1}},{price:{$lt:req.body.price2}}]},{busname:req.body.busname}]})
    .populate('seatplan.user',"name")
    .exec((err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",data})
        }
    })
    
})

router.get('/busseatsavailibility',(req,res)=>{
    let data={
        from:req.body.from,
        to:req.body.to,
        busid:req.body.busid
    }
    let i;
    let count=0
    let e=[]
    //db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )
        BusServices.find({_id:data.busid,$or:[{"seatplan.to":data.from},{"seatplan.seatstatus":"Reserved"}]}).exec((err,doc)=>{
            if(err) console.log(err);
            else {
                for (let x of doc){
                    for (let y of x.seatplan){
                        if(y.to===data.from ||y.seatstatus==="available"){
                            e.push(y)
                            count ++;
                        }
                    }
                }
                
            }
        }),
        setTimeout(() => {
            console.log(e);
                console.log(count);
            return res.json({message:`${count} Seats Available for ${data.from}`})   
        }, 9000);    
})

// SchemaModel.findOneAndUpdate(
//     { course_id: req.body.course_id },
//     { $pull: { "week_schedule.$[].slotsPerDay": req.body.slotID }},
//     { new: true })

router.get('/filterthroughdate',(req,res)=>{
    let data={
        from:req.body.from,
        to:req.body.to,
        date:req.body.date
    }
    BusServices.find({$and:[{dayandtime:data.date},{from:data.from},{stops:{$in:data.to}}]},(err,dataa)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",dataa})
        }
    })
})

router.get('/viewmyprofile',(req,res)=>{
    Users.findOne({_id:req.body.id},(err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",data})
        }
    })
})

router.put('/changepassword',(req,res)=>{
    Users.findOne({_id:req.body.id,password:{$eq:req.body.oldpassword}},(err,doc)=>{
        if(err){
            return res.json({message:"Failed"})
        }
        else{
            if(doc!==null)
            {
            Users.findOneAndUpdate({_id:req.body.id},{password:req.body.newpassword},{new:true},(err,doc)=>{
                if(err){
                    return res.json({message:"Failed",err})
                }
                else
                {
                    let notificationn={
                        userid:req.body.id,
                        notification:"Password Changed"
                    }
                    Notifications.create(notificationn,(err,not)=>{
                        if(err){
                            return res.json({message:"Failed",err})
                        }
                        else{
                            return res.json({message:"Password Changed",doc})
                        }
                    })
                    
                }   
                })
            }
            else
            {
                return res.json({message:"this is not your old password"})
            }
        }
    })
  
})

router.get('/viewnotifications',(req,res)=>{
    Notifications.find((err,data)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"SuccessFull",data})
        }
    })
})
  
module.exports=router;