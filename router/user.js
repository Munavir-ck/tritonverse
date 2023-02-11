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
router.patch("/cartQuantity",cartQuantity)
router.post("/addAddress",addAddress)
router.delete("/address",deleteAddress)
router.post("/checkOutaddress",isAuth,addressCheckout)
router.post("/placeOrder",placerOrder)
router.get("/orderList",orderList)
router.get("/logout",logout)
router.delete("/deleteCart",deleteCart)
router.get("/addressManagement",addressManagement)
router.put("/editAddres",editAddres)
router.post("/couponChecking",couponChecking)
router.get("/orderinvoice",orderInvoice)
router.get("/successPage",successPage)
router.post("/addWishlist",isAuth,addWishlist)
router.get("/addWishlist",isAuth, wishListView)
router.post("/create-order",onlinePayment)
router.get("/verifyPayment",verifyPayment)
router.get("/ordersView",orderView)
router.post("/cancelOrder",cancelOrder)
router.post("/editProfile",editProfile)
router.post("/search",search)









module.exports=router