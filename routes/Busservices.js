const express = require('express')
const Busservice = require('../models/BusServices')
const router = express()
router.post('/createbusservice', (req, res) => {
    
    let i;
    let seatt=[]
    for (i = 1; i <=30; i++) {
        
        seatplan={seatnumber:i}
        seatt.push(seatplan)
        
    }
    let data = {
        busname: req.body.busname,
        class: req.body.class,
        price: req.body.price,
        dayandtime: req.body.dayandtime,
        from:req.body.from,
        stops:req.body.stops,
        seatplan:seatt
    }
    Busservice.create(data, (err, doc) => {
        if (err) {
            return res.json({ message: "Failed", err })
        }
        else { return res.json({ message: "Success", doc }) }
    })
})




router.get('/viewbusservice',(req,res)=>{
    Busservice.find()
    .populate('seatplan.user',"name")
    .exec((err,data)=>{
    if(err)
    {
        return res.json({message:"Failed",err})
    }
    else
    {
        return res.json({message:"Success",data})
    }
    })
})

router.get('/viewseatsbooked',(req,res)=>{
    let date=req.body.date
    Busservice.aggregate
    ([
        {$match:{dayandtime:new Date(date)}},
        {$group:{_id:null,totalseatsbooked:{$sum:"$seatsbooked"}}}
    ]).exec((err,dat)=>{
        if(err)
        {
            return res.json({message:"Failed",err})
        }
        else
        {
            return res.json({message:"Success",dat})
        }
    })
})


router.get('/last7daysseatbookings',(req,res)=>{
    var date=new Date();
    date.setDate(date.getDate()-7);
    Busservice.aggregate
    ([
         
    {$match: {'seatplan.bookingdate': {$gt: date}}},
    {$unwind: '$seatplan'},
    {$match: {'seatplan.bookingdate': {$gt: date}}},
    // {$group:{_id:"$bookingdate",seats:{$count:"seatnumber"}}}
    { $group: { _id:"$seatplan.bookingdate",seats:{$sum:1}}},
    {$project:{year:{$year:"$_id"},month: { $month: "$_id" },day: { $dayOfMonth: "$_id" },seats:1}}



    // year:{ $year: "$seatplan.bookingdate"},
    // month: { $month: "$seatplan.bookingdate" },
    // day: { $dayOfMonth: "$seatplan.bookingdate" }} }

    ]).exec((err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Last 7 days data",docs})
        }
    })
})

router.get('/last7daysearning',(req,res)=>{
    var date=new Date(req.body.date)
    date.setDate(date.getDate()-7);
    Busservice.aggregate
    ([
        {$match: {'seatplan.bookingdate': {$gt:date}}},
        {$unwind: '$seatplan'},
        {$match: {'seatplan.bookingdate': {$gt:date}}},
        // {$group:{_id:"$bookingdate",seats:{$count:"seatnumber"}}}
        { $group: { _id:"$seatplan.bookingdate",seats:{$sum:1},totalprice:{$sum:"$price"}}},
        {$project:{year:{$year:"$_id"},month: { $month: "$_id" },day: { $dayOfMonth: "$_id" },seats:1,totalprice:1}}
    ]).exec((er,docs)=>{
        if(er){
            return res.json({message:"Failed",er})
        }
        else{
            return res.json({message:"Last & days earning",docs})
        }
    })
})


router.get('/total70perc',(req,res)=>{
    var date=new Date(req.body.date)
    date.setDate(date.getDate()-7);
    Busservice.aggregate
    ([
        {$match: {'seatplan.bookingdate': {$gt:date}}},
        {$unwind: '$seatplan'},
        {$match: {'seatplan.bookingdate': {$gt:date}}},
        {$group:{_id:"$_id",totalprice:{$sum:"$price"}}},
        {$project:{totalprice:1,perc70:{$multiply:["$totalprice",0.70]}}}
        // {$group:{_id:"$bookingdate",seats:{$count:"seatnumber"}}}
        // { $group: { _id:"$seatplan.bookingdate",seats:{$sum:1},totalprice:{$sum:"$price"}}},
        // {$project:{year:{$year:"$_id"},month: { $month: "$_id" },day: { $dayOfMonth: "$_id" },seats:1,totalprice:1}},
        //  {$group:{_id:"$year",totalperc:{$sum:"$totalprice"}}}
        // {$project:{totalperc:1,percent:1}}
    ]).exec((er,docs)=>{
        if(er){
            return res.json({message:"Failed",er})
        }
        else{
            return res.json({message:"Last & days earning",docs})
        }
    })
})
module.exports = router;
