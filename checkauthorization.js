const jwt=require('jsonwebtoken')
const Person=require('./models/Users')
const checkauthorization=(req,res,next)=>{
    if(req.body.email!==undefined)
    {
        console.log(req.body.email)
        Person.findOne({email:req.body.email,Authorize:true},(err,doc)=>{
            if(err) 
            {
                return res.json({message:"Failed",err})
            }
            else
            {
                if(doc!==null)
                {
                    jwt.sign({email:req.body.email},'secretkey',{expiresIn:40},(err,token)=>{
                    // return res.json({message:"Success",token:token,user:data})
                    req.token = token
                    req.doc = doc
                    next()
                    })
                    
                }
                else
                {
                    return res.json("Not authorized")
                }
                
            }
        }) 
    }
}

module.exports=checkauthorization;