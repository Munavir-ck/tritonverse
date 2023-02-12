const express=require('express')
const { postLogin } = require('../controllers/admincontrollers')
const router=express.Router()
const {userverification}=require("../middileware/userverification")
const{isAuth}=require('../middileware/authentication')

const{
    signup,
    postSignup,
    userLogin,
    userPostLogin,
    userHome,
    displayProduct,
    productDetail,
    displayCart,
    checkOut,
    addCart,
    OTP,
    PostOtp,
    MobileVerify,
    profile,
    cartQuantity,
    addAddress,
    deleteAddress,
    addressCheckout,
    placerOrder,
    orderList,
    logout,
    deleteCart,
    addressManagement,
    editAddres,
    couponChecking,
    successPage,
    orderInvoice,
    addWishlist,
    wishListView,
    onlinePayment,
    verifyPayment,
    orderView,
    cancelOrder,
    editProfile,
    
    search,
    blog,
    contact,
  
   
   
   
}=require("../controllers/usercontrollers")

router.get('/',userHome)
router.get("/signup",signup)
router.post('/postSignup',postSignup)
router.post('/postLogin',userPostLogin)
router.get('/login',userLogin)
router.get("/displayProduct",displayProduct)
router.get("/productDetail",productDetail)
router.get("/displayCart",isAuth,displayCart)
router.get("/checkOut",isAuth,checkOut)
router.get("/addCart", userverification, addCart)
router.post("/OTP", OTP)
router.post("/otpVerify",PostOtp)
router.get("/MobileVerify",MobileVerify)
router.get("/profile",isAuth,profile)
router.patch("/cartQuantity",userverification,cartQuantity)
router.post("/addAddress",userverification,addAddress)
router.delete("/address",userverification,deleteAddress)
router.post("/checkOutaddress",isAuth,addressCheckout)
router.post("/placeOrder",userverification,placerOrder)
router.get("/orderList",isAuth,orderList)
router.get("/logout",logout)
router.delete("/deleteCart",userverification,deleteCart)
router.get("/addressManagement",userverification,addressManagement)
router.put("/editAddres",userverification,editAddres)
router.post("/couponChecking",userverification,couponChecking)
router.get("/orderinvoice",isAuth,orderInvoice)
router.get("/successPage",isAuth,successPage)
router.post("/addWishlist",userverification,addWishlist)
router.get("/addWishlist",isAuth, wishListView)
router.post("/create-order",userverification,onlinePayment)
router.get("/verifyPayment",userverification,verifyPayment)
router.get("/ordersView",userverification,orderView)
router.post("/cancelOrder",isAuth,cancelOrder)
router.post("/editProfile",userverification,editProfile)
router.post("/search",search)
router.get("/blog",blog)
router.get("/contact",contact)









module.exports=router