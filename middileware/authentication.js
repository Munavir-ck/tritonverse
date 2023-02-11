
const isAuth=(req,res,next)=>{
   if(req.session.isAuth==true){
      console.log(1111111111111111111111111111);
      if(req.session.login.access==true){
         next( )
      }
      else{
      
         res.redirect("/login") 
      }
   
   }
   else{
    res.redirect("/login")
   }
}

const AdminIsAuth=(req,res,next)=>{
    if(req.session.isAuth){
     next()
    }
    else{
     res.redirect("/admin")
    }
 }
//  const isBlock=(req,res,next)=>{
//    if()
//    console.log(req.session.login.access);
//    if(req.session.login.access==true){
//        next()
//    }
//    else{
//        console.log("illaaaaaaaaaaaaaa");
       
//    }
// }
 module.exports={isAuth,AdminIsAuth}