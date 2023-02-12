const express=require('express')
const router=express.Router()
const{storeImage}=require('../middileware/multer')
const{AdminIsAuth}=require('../middileware/authentication')
const{productPhotos}=require('../middileware/multer2')
const{adminVerify}=require('../middileware/userverification')

const{
    adminLogin ,
    adminDashboard,
    adminLogout, 
    postLogin,  
    products,
    addproduct,
    addcategory,
    postaddCategory,
    postAddproduct ,
    deleteProduct,
    editProductPage,
    updateProduct,
    deleteCategory,
    userList,
    deleteList,
    blockList,
    coupen,
    viewaddCoupen,
    addCoupen,
    deleteCoupen,

    orderDetail,
    orderStatus,
    dailyReport,
    monthlyReport,
    yearlyReport,
    pieChart,
    monthlylineChart,
    drawBarChart,
    dailyChart,
    banner,
    addBanner,
    viewaddBanner,
    deleteBanner,
    orders,
    editBanner,
    editView,


}=require('../controllers/admincontrollers')

router.get('/',adminLogin)
router.get('/home',AdminIsAuth,adminDashboard)
                             
router.get('/logout',adminLogout)
router.post('/Postlogin',postLogin)
router.get("/products",AdminIsAuth,products)
router.get("/addproduct",AdminIsAuth,addproduct)
router.get("/addcategory",AdminIsAuth,addcategory)
router.get("/deleteProduct/:id",AdminIsAuth,deleteProduct)
router.post("/postaddCategory",storeImage,postaddCategory)
router.post("/postAddProduct",storeImage,AdminIsAuth,postAddproduct )
router.get("/editProduct/:id",AdminIsAuth,storeImage, editProductPage)
router.post("/updateProduct/:id",storeImage,updateProduct)
router.get("/deleteCategory/:id",AdminIsAuth, deleteCategory)
router.get("/userList",AdminIsAuth,userList)
router.get("/deleteList/:id",deleteList)
router.get("/block",adminVerify,blockList)
router.get("/coupen",AdminIsAuth,coupen)
router.get("/viewaddCoupen", AdminIsAuth,viewaddCoupen)
router.post("/addCoupen",adminVerify,addCoupen)
router.delete("/coupen",deleteCoupen)
router.get("/orderDetail/:id",AdminIsAuth,orderDetail)
router.post("/changeOrderStatus",orderStatus)
router.get("/dailyReport",AdminIsAuth,dailyReport)
router.get("/monthlyReport",AdminIsAuth,monthlyReport)
router.get("/yearlyReport",AdminIsAuth,yearlyReport)
router.get("/graph",pieChart)
router.get("/monthlylineChart",monthlylineChart)
router.get("/drawBarChart",drawBarChart)
router.get("/dailyChart",dailyChart)
router.get("/addBanner",AdminIsAuth,viewaddBanner)
router.get("/banner",AdminIsAuth,banner)
router.post("/addBanner",productPhotos,addBanner)
router.get("/dltbanner",deleteBanner)
router.get("/orders",orders)
router.get("/editBanner/:id",AdminIsAuth,editView)
router.post("/editBanners/:id",productPhotos,editBanner)







module.exports=router