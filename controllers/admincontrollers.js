const Product = require("../models/user/productschema");
const Category = require("../models/user/category");
const UserList=require("../models/user/user")
const coupenDB = require("../models/coupen");
const orderDB = require("../models/user/order");
const addressDB = require("../models/user/address");
const { orderDetails } = require("./usercontrollers");
const { aggregate } = require("../models/coupen");
const bannerDB=require("../models/user/bannner")

const adminLogin = (req, res) => {
  res.render("admin/adminlogin", { message: false });
};

const adminDashboard = async (req, res) => {
  const orders = await orderDB.find().sort({createdAt:-1})
  console.log(orders);
  res.render("admin/dashboard", { orders });
};
const adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

const postLogin = (req, res) => {
  const adminemail = process.env.adminemail;
  const adminpassword = process.env.adminpassword;
  console.log(adminpassword);
  if (req.body.useremail == adminemail && req.body.password == adminpassword) {
    req.session.isAuth = true;
    res.redirect("/admin/home");
  } else {
    res.render("admin/adminlogin", { message: "invalid user" });
  }
};

const products = async (req, res,next) => {
  try {
    const categoryList = await Category.find();

    console.log(categoryList);

    const productList = await Product.find();

    res.render("admin/products", {
      categoryList,
      productList,
      message: req.flash("message"),
    });
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
};
const addcategory = (req, res) => {
  res.render("admin/addcategory",{message:req.flash("message")});
};

const addproduct = async (req, res,next) => {
  try {
    
     
    const categoryList = await Category.find();

    res.render("admin/addproduct", { categoryList });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
};
const postaddCategory = async (req, res,next) => {
  try {
    const categoryName= req.body.name
     const name=new RegExp(`^${req.body.name}`,"i");
     let check=await Category.findOne({ name:{$regex:name}})
     if (check) {
      req.flash("message","Categery Already Exist")
      res.redirect("/admin/addcategory")
     }
     else{
      const image = req.files;

      if (image == false) {
        res.redirect("/admin/addCategory");
      } else {
        let imageUrl = image[0].path;
        imageUrl = imageUrl.substring(6);
  
        const addcategory = await Category.create({
          name: categoryName,
          image: imageUrl,
          description: req.body.description,
        });
  
        res.redirect("/admin/products");
      }
     }

   
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
};
const postAddproduct = async (req, res,next) => {
  try {
    let image = req.files;

    let img = [];
    for (let i = 0; i < image.length; i++) {
      img[i] = image[i].path.substring(6);
    }

    if (img == false) {
      res.redirect("/admin/addproduct");
    } else {
      const addproduct = await Product.create({
        name: req.body.name,

        image: img,

        price: req.body.price,

        discription: req.body.description,

        category: req.body.category,

        brand: req.body.brand,

        quantity: req.body.Quantity,

        discount: req.body.Discount,
      });

      res.redirect("/admin/addproduct");
    }
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
};

const deleteProduct = async (req, res,next) => {
  try {
    const ID = req.params.id;

    const deleteProduct = await Product.deleteOne({ _id: ID });
    req.flash("message", "Successfully deleted");
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
};
const editProductPage = async (req, res,next) => {
  try {
    const ID = req.params.id;
    console.log(ID);
    const data = await Product.findById(ID);
    const category = await Category.findById(data.category);

    const listCategory = await Category.find();

    res.render("admin/editproduct", { data, listCategory, category });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
};
const updateProduct = async (req, res,next) => {
  try {
    const ID = req.params.id;

    let image = req.files;

    if (image == !null) {
      let img = [];
      for (let i = 0; i < image.length; i++) {
        img[i] = image[i].path.substring(6);
      }

      const { name, discription, category, quantity, Date, price } = req.body;

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: ID },
        { name, discription, category, quantity, price, Date, image: img }
      );
    } else {
      const { name, discription, category, quantity, Date, price } = req.body;

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: ID },
        { name, discription, category, Date, quantity, price }
      );
    }
    req.flash("message", "Successfully Edited");
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
};

const deleteCategory = async (req, res,next) => {
  try {
    const ID = req.params.id;
    const deleteCategory = await Category.deleteOne({ ID });

    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
};

const userList = async (req, res,next) => {
  try {
    const userList = await UserList.find();
    res.render("admin/userlist", { userList });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
};
const deleteList = async (req, res,next) => {
  try {
    const ID = req.params.id;
    const deleteUser = await UserList.deleteOne({ _id: ID });
    res.redirect("/admin/userList");
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
};

const blockList = async (req, res,next) => {
  try {
    if (req.query.blk) {
      console.log("block");
      const blockList = await UserList.findOneAndUpdate(
        { _id: req.query.blk },
        { access: false }
      );
      res.json({ status: true });
    } else if (req.query.unblk) {
      console.log("unblock");
      const blockList = await UserList.findOneAndUpdate(
        { _id: req.query.unblk },
        { access: true }
      );
      res.json({ access: true });
    }  
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }

};
const coupen = async (req, res,next) => {
  try {
    const allCoupens = await coupenDB.find({});

    res.render("admin/coupen", { allCoupens });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const viewaddCoupen = async (req, res,next) => {
  res.render("admin/addcoupen");
};
const addCoupen = async (req, res) => {
  try {
    const coupenName=req.body.coupenCode
    const name=new RegExp(`^${coupenName}`,"i")
    
    let check=await coupenDB.findOne({coupenCode:{$regex:name}})
    if(check){
     
      res.json({status:false})
    }else{
  
      const addCoupen = await coupenDB.create(req.body);
    
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
  
 

};
const deleteCoupen = async (req, res,next) => {
 try {
  const coupen = await coupenDB.findByIdAndDelete(req.query.dltID);
  res.json({ status: true });
 } catch (error) {
  console.log(error);
  error.admin=true
  next(error)
 }
 
};
const orderDetail = async (req, res,next) => {
 try {
  const orderDetails = await orderDB.findById(req.params.id).populate("products.Product")

  const allAddress = await addressDB.findOne({ user: orderDetails.buyer });

  let index = allAddress.address.findIndex(
    (x) => x._id == orderDetails.address
  );

  const deliveryAddress = allAddress.address[index];

  res.render("admin/orderview", { orderDetails, deliveryAddress });
 } catch (error) {
  console.log(error);
  error.admin=true
  next(error)
 }
 
};
const orderStatus = async (req, res,next) => {
  try {
    const orderID = req.query.id;
    const Status = req.query.status;
    console.log(Status, orderID);
    const order = await orderDB.updateOne(
      { _id: orderID },
      { orderstatus: req.query.status }
    );
    res.json({ Status: true });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const dailyReport = async (req, res,next) => {
  try {
    const dailyReports = await orderDB.aggregate([
      {
        $match: {
          orderstatus: { $eq: "Delivered" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalprice: { $sum: "$totalPrice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    console.log(dailyReports[0].totalprice);
    console.log(dailyReports);
    res.render("admin/dailyreport", { dailyReports });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
  
};

const monthlyReport = async (req, res,next) => {

  try {
    const monthlyReports = await orderDB.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalprice: { $sum: "$totalPrice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    console.log(monthlyReports);
    function getMonthName(monthNumber) {
      const date = new Date();
      date.setMonth(monthNumber - 1);
  
      return date.toLocaleString("en-US", { month: "long" });
    }
    let month = [];
    for (let i = 0; i < monthlyReports.length; i++) {
      month.push(getMonthName(monthlyReports[i]._id.month));
    }
  
    res.render("admin/monthlyreport", { monthlyReports, month });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error);
  }
 
};
const yearlyReport = async (req, res,next) => {

  try {
    const yearReport = await orderDB.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          totalprice: { $sum: "$totalPrice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(yearReport);
    res.render("admin/yearlyreport", { yearReport });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const pieChart = async (req, res,next) => {

  try {
    const orderDelivered = await orderDB
    .find({ orderstatus: "Delivered" })
    .count();
  const orderCancelled = await orderDB
    .find({ orderstatus: "Cancelled" })
    .count();
  const orderReturned = await orderDB.find({ orderstatus: "Returned" }).count();

  console.log(orderCancelled);
  console.log(orderDelivered);
  let data = [];
  data.push(orderDelivered);
  data.push(orderCancelled);
  data.push(orderReturned);
  console.log(data);
  res.json({ data });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const monthlylineChart = async (req, res,next) => {

  try {
    const monthlyReports = await orderDB.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalprice: { $sum: "$totalPrice" },
          products: { $sum: { $size: "$products" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": -1 } },
    ]);
  
    let ordersTotal = [];
    let salesprofit = [];
    let orderCount = [];
    for (let i = 0; i < monthlyReports.length; i++) {
      console.log(monthlyReports[i]);
      ordersTotal.unshift(monthlyReports[i].totalprice);
      orderCount.unshift(monthlyReports[i].count);
      salesprofit.unshift(monthlyReports[i].totalprice * (15 / 100));
    }
    res.json({ status: true, ordersTotal, salesprofit, orderCount });
  
    console.log(ordersTotal, salesprofit, orderCount);
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const dailyChart = async (req, res,next) => {

  try {
    const order = await orderDB.find({});
  let today = new Date();
  let startDate = new Date(today.setUTCHours(0, 0, 0, 0));
  let endDate = new Date(today.setUTCHours(23, 59, 59, 999));

 const todaySales = await orderDB.aggregate([
    {
      $match: {
        orderstatus: { $eq: "Delivered" },
        createdAt: { $lt: endDate, $gt: startDate },
      },
    },
    {
      $group: {
        _id: "",

        total: { $sum: "$totalPrice" },
        count:{$sum:1}
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  const totalAmount=todaySales[0].total
  const totalOrder=todaySales[0].count
  console.log( totalAmount,1111111);
    res.json({status:true,totalAmount,totalOrder})
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
  
  
};
const drawBarChart = async (req, res,next) => {

  try {
    const yearReport = await orderDB.aggregate([
      {
        $match: { orderstatus: { $eq: "Delivered" } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          totalprice: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": -1 } },
    ]);
    let totalSales = [];
    let years = [];
  
    for (let i = 0; i < yearReport.length; i++) {
      totalSales.push(yearReport[i].totalprice);
      years.push(yearReport[i]._id.year);
    }
    console.log(years);
    console.log(totalSales);
  
    res.json({ status: true, totalSales, years });
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
};
const banner=async(req,res,next)=>{

  try {
    const banner=await bannerDB.find({})
    console.log(111111111111111);
    console.log(banner);
    if(banner){
    res.render("admin/banner",{banner})}
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
}
const  viewaddBanner=(req,res)=>{
   
    res.render("admin/addbanner")
  }
 

const addBanner=async(req,res,next)=>{


  try {
    console.log(req.files);
 console.log(req.body);
 const image=req.files
 if(image==false){
  res.redirect("/admin/addBanner")
 }
 else{
  console.log(1212121212);
  let img=image[0].path.substring(6);
  console.log(img);
  Object.assign(req.body, { image: img});
  console.log(req.body);
   const banner=await bannerDB.create(
   req.body
   )
   res.redirect("/admin/addBanner")
 }
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
 
}
const editView=async(req,res,next)=>{
  ID=req.params.id
  console.log(ID);
  const banner=await bannerDB.findById(ID)
  console.log(banner);
  res.render("admin/editbanner",{banner})
}
const  editBanner=async(req,res)=>{
  console.log(1121212121212);
  ID=req.params.id
  console.log(ID);
  const image=req.files
  console.log(req.body);
  if(image == !null){
    let img=image[0].path.substring(6);
    Object.assign(req.body, { image: img});
    const banner=await bannerDB.updateOne({_id:ID},req.body)
    res.redirect("/admin/banner")
  }else{
    const banner=await bannerDB.updateOne({_id:ID},req.body)
    res.redirect("/admin/banner")
    console.log(222222222222);
  }
  
}
const deleteBanner=async(req,res,next)=>{
  try {
    console.log(777777777777777);
    console.log(111111111112222222222);
    const bannerID=req.query.dltID
    console.log(bannerID);
    const remove=await bannerDB.findByIdAndDelete(bannerID)
    res.json({status:true})
  } catch (error) {
    console.log(error);
   error.admin=true
   next(error)
  }
 
}

const orders=async(req,res,next)=>{
  try {
    
    const orders = await orderDB.find().sort({createdAt:-1})
    res.render("admin/orders",{orders})
  } catch (error) {
    console.log(error);
    error.admin=true
    next(error)
  }
}

module.exports = {
  adminLogin,
  adminDashboard,
  adminLogout,
  postLogin,
  products,
  addproduct,
  addcategory,
  postaddCategory,
  postAddproduct,
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
};
