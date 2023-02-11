const express=require("express")
const app=express()
const ejs=require("ejs")
const db=require("./config/server")
const session=require("express-session")
 require("dotenv").config()
 const nocache = require("nocache");
 const flash=require("connect-flash")
 const $ = jQuery = require('jquery');
 const cartDb=require('./models/user/cart')
 const wishListDB=require('./models/wishlist')
 const userDB=require("./models/user/user")
//  const {swal}=require("sweetalert")





const path=require("path")




app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
 
const adminRouter=require('./router/admin')
const userRouter=require('./router/user')


db.dbConnection((res)=>{
    if(res){
        console.log("moongoose running");
    }else{
        console.log("err");
    }
})
app.use(express.json())

app.use(session({
    secret:"sessionKey",
    resave : false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))
app.use( (req, res, next)=> {
    res.locals.session = req.session;
  
    next();
  });

app.use((req,res,next)=>{
    if(req.session.login){
const id = req.session.login._id

 cartDb.findOne({owner:id}).then((data)=>{
        if( data){
          userDB.findById(id).then((user)=>{
            const name=user.name
            res.locals.Username=name
          })
         const length = data.items.length
        
         res.locals.count=length
         req.User = true
         next()}
         else{
            res.locals.count=0
            res.locals.Username=null
            next()
         }
 })
    }else{
       
        next()
    }
})
app.use((req,res,next)=>{
    if(req.session.login){
        const id=req.session.login._id
        wishListDB.findOne({user:id}).then((data)=>{
           if(data){ const length=data.items.length
            res.locals.wishlistCount=length
           
            next()}
            else{
                res.locals.wishlistCount=0
                next()  
            }
        })

    }
    else{
        next()
    }
})


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));  

app.use(nocache());
app.use(flash())


app.use("/admin", adminRouter)
app.use("/",userRouter)

app.use(function(req, res, next) {
    const error = new Error(`Not found ${req.originalUrl}`)
    if(req.originalUrl.startsWith('/admin')){
      error.admin=true
    }
    error.status = 404
    next(error)
      });
      
      // error handler
      app.use(function(err, req, res, next) {
    console.log(err,'hiiiiiiiiiiiiiiiiiiierrorkutan');
        // render the error page
        // res.status(err.status || 500);
        if(err.status==404){
          if(err.admin){
            res.render('admin_404',{error:err.message});
          }else{
            console.log("hiiiiiiiii");
            res.render('error',{error:err.message});
          }
  
        }else{
            if(err.status==500){
                res.render('error_500',{error:'unfinded error'})
            }else{
          if(err.admin){
            console.log('yutytytyt');
            res.render('admin_404',{error:'server down'})
          }else{
            res.render('error',{error:'server down'})
          }
            }
          }
      })


app.listen(5000,()=>{
   console.log("server started");
})

// module.exports=app

