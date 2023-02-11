const express=require('express')
const router=express.Router()
const{storeImage}=require('../middileware/multer')
const{AdminIsAuth}=require('../middileware/Authentication')
const{productPhotos}=require('../middileware/multer2')

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
router.post("/postAddProduct",storeImage,postAddproduct )
router.get("/editProduct/:id",AdminIsAuth,storeImage, editProductPage)
router.post("/updateProduct/:id",storeImage,updateProduct)
router.get("/deleteCategory/:id",AdminIsAuth, deleteCategory)
router.get("/userList",userList)
router.get("/deleteList/:id",deleteList)
router.get("/block",blockList)
router.get("/coupen",coupen)
router.get("/viewaddCoupen", viewaddCoupen)
router.post("/addCoupen",addCoupen)
router.delete("/coupen",deleteCoupen)
router.get("/orderDetail/:id",orderDetail)
router.post("/changeOrderStatus",orderStatus)
router.get("/dailyReport",dailyReport)
router.get("/monthlyReport",monthlyReport)
router.get("/yearlyReport",yearlyReport)
router.get("/graph",pieChart)
router.get("/monthlylineChart",monthlylineChart)
router.get("/drawBarChart",drawBarChart)
router.get("/dailyChart",dailyChart)
router.get("/addBanner",viewaddBanner)
router.get("/banner",banner)
router.post("/addBanner",productPhotos,addBanner)
router.get("/dltbanner",deleteBanner)
router.get("/orders",orders)
router.get("/editBanner/:id",editView)
router.post("/editBanners/:id",productPhotos,editBanner)







module.exports=router