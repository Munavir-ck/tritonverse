const userverification=(req,res,next)=>{
    if(req.session.login){
        console.log("illa");
   next()
    }
    else{
        console.log("illaaaaaaaaaaaaaa");
        res.json({notlogged:true})
    }
}

const adminVerify=(req,res,next)=>{
    if(req.session.isAuth){
        next()
       }
       else{
       res.json({notlogged:true})
       }
}


module.exports= {userverification,adminVerify};