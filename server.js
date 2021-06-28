const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const url='mongodb://localhost/Busticket';
const userroute=require('./routes/Users');
const busserviceroute=require('./routes/Busservices');
const ticketroute=require('./routes/Ticket');
const bookingroute=require('./routes/Booking');
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection;
db.once('open',()=>{
    console.log('connect to mongodb database')
})

app.use(bodyParser.json())
app.use('/user',userroute)
app.use('/busservice',busserviceroute)
app.use('/ticket',ticketroute)
app.use('/booking',bookingroute)

app.get('/',(req,res)=>{
res.send('<h1>Hello owais</h1>')
})



const PORT=process.env.PORT || 4000
app.listen(PORT,()=>{console.log(`Server started at port ${PORT}`)})