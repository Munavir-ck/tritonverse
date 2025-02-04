const User = require("../models/user/user")
const bcrypt = require("bcrypt");
const Product = require("../models/user/productschema");
const Category = require("../models/user/category");
const { sendotp, verifyotp } = require("../Utilities/otp");
const mongoose = require("mongoose");
const cartDb = require("../models/user/cart");
const addressDb = require("../models/user/address");
// const cart = require("../models/user/cart");
const orderDb = require("../models/user/order");
const { data } = require("jquery");
const OrderDB = require("../models/user/order");
const couponDB = require("../models/coupen");
const address = require("../models/user/address");
const wishListDB = require("../models/wishlist");
const { exists } = require("../models/user/productschema");
const paypal = require("@paypal/checkout-server-sdk");
const { findOne } = require("../models/coupen");
// const { findByIdAndUpdate } = require("../models/user/userschema");
const bannerDb=require("../models/user/bannner")

const envirolment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalCliend = new paypal.core.PayPalHttpClient(
  new envirolment(process.env.clientID, process.env.sceretID)
);

const signup = (req, res,next) => {
  res.render("user/usersignup", { message: false });
};
const userLogin = (req, res) => {
  res.render("user/userlogin",{message:req.flash("message")});
};
const userHome = async (req, res,next) => {
  try {
    
    
    let count = res.locals.count;
    let name=res.locals.Username
    let wishlistCount = res.locals.wishlistCount;
    console.log(wishlistCount, "ennnnnxnnxnxnxnxnxnx");
  
    const categoryList = await Category.find();
    const banner=await bannerDb.find({})
    console.log(banner);
    console.log(categoryList); 
    console.log(categoryList.lenght);
    const ALL = req.query.allCat;
    const ID = req.query.catID;
  
    if (ID) {
      const shop = await Product.find({ category: ID,  });
    
  
      res.render("user/userhome", { shop, categoryList, count, wishlistCount, banner,name, });
    } else if (ALL) {
      const shop = await Product.find();
      res.render("user/userhome", { shop, categoryList, count, wishlistCount , banner,name,});
    } else {
      const shop = await Product.find();
      res.render("user/userhome", { shop, categoryList, count, wishlistCount , banner,name,});
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const userPostLogin = async (req, res,next) => {
  try {
    let count = res.locals.count;
   
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);

    if (user) {
      console.log(user.email);
      await bcrypt.compare(password, user.password, (err, data) => {
        if (err) {
          console.log(err);
        } else if (data ==!null) {
          req.session.isAuth = true;
          req.session.loggedin = true;
          req.session.login = user;
          console.log(req.session.login);
          console.log("login success");
          res.redirect("/");
        } else {
          req.flash("message","Wrong Password")
          res.render("user/userlogin");
        }
      });
    } else {
      req.flash("message","Wrong Mail")
      res.render("user/userlogin");
    }
  } catch (error) {

    console.log(error);
    next(error)
  }
};

const postSignup = async (req, res,next) => {
  try {
    const user = await User.find({ email: req.body.useremail });

    console.log(222222);
    

    if (user == true) {
      console.log("user");
      res.redirect("/signup");
    } else {
      const password = req.body.userpassword;
      const confirmpassword = req.body.confirmpassword;

      if (password == confirmpassword) {
        let userpassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          name: req.body.username,
          email: req.body.useremail,
          password: userpassword,
          phone: req.session.phone,
        });

        res.redirect("/login");
      } else {
        res.render("user/usersignup", { message: "Password not matching" });
      }
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const displayProduct = async (req, res,next) => {
  try {
    let count = res.locals.count;
    let wishlistCount = res.locals.wishlistCount;
    let name=res.locals.Username
    const categoryList = await Category.find();

    const ALL = req.query.all;
    const ID = req.query.men;

    if (ID) {
      const shop = await Product.find({ category: ID});

      res.render("user/displayproduct", {
        shop,
        categoryList,
        count,
        wishlistCount,
        name
      });
    } else if (ALL) {
      const shop = await Product.find();
      res.render("user/displayproduct", {
        shop,
        categoryList,
        count,
        wishlistCount,
        name
      });
    } else {
      const shop = await Product.find();
      res.render("user/displayproduct", {
        shop,
        categoryList,
        count,
        wishlistCount,
        name
      });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const productDetail = async (req, res,next) => {
  try {
    let count = res.locals.count;
    let wishlistCount = res.locals.wishlistCount;
    let name=res.locals.Username
    const productDetail = await Product.findOne({ _id: req.query.cat })
    const products=await Product.find({category:productDetail.category})
    console.log(products);

    res.render("user/productdetails", { productDetail, count, wishlistCount,products,name });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// const displayCategoryList = async (req, res,next) => {
//   console.log(2222222222222);
// };
const displayCart = async (req, res,next) => {
  try {
    const userId = req.session.login._id;
    let name=res.locals.Username

    // const cartCount=await cartDb.findOne({owner:userId})
    // const count=cartCount.items.length

    const Cart = await cartDb
      .findOne({ owner: userId })
      .populate("items.Product");

    res.render("user/shopingcart", { Cart, message: req.flash("message") ,name});
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const checkOut = async (req, res,next) => {
  try {
    let name=res.locals.Username
    const userID = req.session.login._id;
    console.log("asdsdsD");
    console.log(userID);
    const Address = await addressDb.findOne({user:userID});
    const Cart = await cartDb
      .findOne({ owner: userID })
      .populate("items.Product");
    console.log(Cart);
    let checking = false;
    let stockOut = [];
    console.log("checking");

    for (let i = 0; i < Cart.items.length; i++) {
      if (Cart.items[i].quantity > Cart.items[i].Product.quantity) {
        checking = true;
        stockOut.push(Cart.items[i].Product.name);
      }
      console.log("checked");
    }
    if (checking == true) {
      console.log("No stock");
      req.flash("message", stockOut + "Product Not  available");
      console.log("No stock");
      res.redirect("/displayCart");
    } else {
      res.render("user/checkOut", {
        Address,
        Cart,
        paypalclientid: process.env.clientID,
        name
      });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const addCart = async (req, res,next) => {
  try {
    let productId = req.query.Prdct;
    console.log(productId);
    console.log(req.session.login);
    if (req.session.login == null) {
      console.log("No user");
      res.json({ notlogged: true });
    } else {
      productId = req.query.Prdct;

      userId = req.session.login._id;

      const UserCart = await cartDb.findOne({ owner: userId });
      console.log(1111111111);

      const Prodct = await Product.findById(productId);
      console.log(Prodct.quantity);

      if (Prodct.quantity > 0) {
        console.log("okkkkk aaaasasasasasasasas");
        console.log(UserCart);
        if (UserCart == null) {
          const AddCart = await cartDb.create(
            {
              owner: userId,
              items: [
                {
                  Product: productId,
                  Price: Prodct.price,
                  quantity: 1,
                },
              ],
              cartTotal: Prodct.price,
            },
            { new: true }
          );

          console.log("Cart added");
        } else {
          const findProdct = await cartDb.findOne({
            owner: userId,
            "items.Product": productId,
          });
          if (findProdct) {
            let index = UserCart.items.findIndex((x) => x.Product == productId);
            console.log(index + "cccccccc");
            const cartQuantity = UserCart.items[index].quantity;
            const prdctQuantity = Prodct.quantity;
            console.log(prdctQuantity + "product quantity");
            console.log(cartQuantity);
            if (cartQuantity < prdctQuantity) {
              const AddProduct = await cartDb.findOneAndUpdate(
                {
                  owner: userId,
                  "items.Product": productId,
                },
                {
                  $inc: {
                    "items.$.quantity": 1,
                    "items.$.Price": Prodct.price,
                    cartTotal: Prodct.price,
                  },
                },
                { new: true }
              );
              console.log("added multiple product");
            } else {
              res.json({ stock: false });
              console.log("No stock");
            }
          } else {
            const AddNewProduct = await cartDb.findOneAndUpdate(
              {
                owner: userId,
              },
              {
                $push: {
                  items: { Product: productId, Price: Prodct.price },
                },
                $inc: {
                  cartTotal: Prodct.price,
                },
              },
              { new: true }
            );
            console.log("added another product");
          }
        }
        res.json({ stock: true });
      } else {
        console.log("No stock");
        res.json({ notAvailable: true });
      }
    }
    //  const count=await cartDb.aggregate([{$match:{owner:userId}},{ $project: {name:1, stockCount: {$size: "$items"}}}])
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const MobileVerify = (req, res) => {
  res.render("user/mobile");
};

const OTP = (req, res) => {
  req.session.phone = req.body.mobileNo;
  console.log(req.session.phone);
  const phone=req.session.phone
  sendotp(req.session.phone);

  res.render("user/otp",{message:null,phone})
};
const PostOtp = (req, res,next) => {

  try {
    const userOtp = req.body.name;
    console.log(req.session.phone);
    const phone=req.session.phone
    const UserOtp = userOtp.join("");
    console.log(UserOtp);
    const verified = verifyotp(req.session.phone, UserOtp).then(
      (verification_check) => {
        if (verification_check.status == "approved") {
          res.redirect("/signup");
        } else if (verification_check.status == "pending") {
        
          res.render("user/otp",{message:"Incorrect OTP",phone});
        }
      }
    );
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};
const profile = async (req, res,next) => {
  try {
    const UserInfo = await User.findById(req.session.login._id);
    const Addresss = await addressDb.findOne({user:req.session.login._id});
    let name=res.locals.Username
    let Address;
    if (Addresss) {
      Address = Addresss.address;
    } else {
      Address = [];
    }
    res.render("user/profile", { Address, UserInfo,name });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const cartQuantity = async (req, res,next) => {
  try {
    const userid = req.session.login._id;
    const product = await Product.findById(req.query.prdctID);
    console.log(product);
    console.log(req.query.number, " test1");
    console.log(req.query.prdctID);
    const carT = await cartDb.findOne({ owner: userid });
    let index2 = carT.items.findIndex((x) => x.Product == req.query.prdctID);
    console.log(index2 + "this is index");
    let cartQty = carT.items[index2].quantity;

    const prdctQty = product.quantity;
    console.log(cartQty, prdctQty, 1234567);
    if (req.query.number == 1) {
      console.log(cartQty, prdctQty);
      if (cartQty  < prdctQty) {
        const cart = await cartDb.findOneAndUpdate(
          { owner: userid, "items.Product": req.query.prdctID },
          {
            $inc: {
              "items.$.quantity": 1,
              "items.$.Price": product.price,
              cartTotal: product.price,
            },
          },
          { new: true }
        );
        console.log(cart);
        let index = cart.items.findIndex((x) => x.Product == req.query.prdctID);
        console.log("+test2", cart.items[index].quantity, index);

        res.json({
          price: cart.items[index].Price,
          quantity: cart.items[index].quantity,
          totalPrice: cart.cartTotal,
        });
      } else {
        console.log("No stock.....");
        res.json({
          stock: true,
        });
      }
    } else if (req.query.number == -1) {
      console.log("haaaaaaaaaaaaaaaaaaaijhdajkshdajkdhaklsla");
      const cart = await cartDb.findOneAndUpdate(
        { owner: userid, "items.Product": req.query.prdctID },
        {
          $inc: {
            "items.$.quantity": -1,
            "items.$.Price": -product.price,
            cartTotal: -product.price,
          },
        },
        { new: true }
      );
      let index = cart.items.findIndex((x) => x.Product == req.query.prdctID);
      console.log("-");

      if (cart.items[index].quantity <= 0) {
        res.json({
          quantity: null,
        });
      } else {
        res.json({
          price: cart.items[index].Price,
          totalPrice: cart.cartTotal,
          quantity: cart.items[index].quantity,
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const addAddress = async (req, res,next) => {
  console.log(1111111111111111);
  try {
    console.log(req.body);
    const { fullName, phone, state, area, pinCode, buildingName } = req.body;
    const userID = req.session.login._id;
    const UsereExist = await addressDb.findOne({user:userID });
    if (UsereExist) {
      console.log(fullName);
      const addNewAddress = await addressDb.findOneAndUpdate(
        { user: userID },
        {
          $push: {
            address: {
              fullName,
              phone,
              state,
              pinCode,
              area,
              buildingName,
            },
          },
        }
      );
      res.json({
        status: true,
      });
    } else {
      const user = req.body;
      console.log(user);

      console.log(fullName);
      const addAddress = await addressDb.create({
        address: {
          fullName,
          phone,
          state,
          pinCode,
          area,
          buildingName,
        },
        user: userID,
      });
      res.json({
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
// const deleteAddress = async (req, res) => {
//   console.log(req.query.dlt);
//   const dltAddress = await address.findByIdAndDelete(req.query.dlt);
//   res.json({ status: true });
// };

const addressCheckout = async (req, res,next) => {
  try {
    const userID = req.session.login._id;
    const { fullName, phone, state, area, pinCode, buildingName } = req.body;
    const UsereExist = await addressDb.findOne({ user: userID });
    if (UsereExist) {
      const addNewAddress = await addressDb.findOneAndUpdate(
        { user: userID },
        {
          $push: {
            address: {
              fullName,
              phone,
              state,
              pinCode,
              area,
              buildingName,
            },
          },
        }
      );
      res.redirect("/checkOut");
    } else {
      const user = req.body;
      console.log(user);

      const addAddress = await addressDb.create({
        address: {
          fullName,
          phone,
          state,
          pinCode,
          area,
          buildingName,
        },
        user: userID,
      });
      res.redirect("/checkOut");
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const deleteAddress = async (req, res,next) => {
  console.log(11111111111);
  const dltID = req.query.dlt;
  const userID = req.session.login._id;
  console.log(dltID);
  const dltAddress=await addressDb.updateOne(
    { user: userID },
    { $pull: { address: { _id: dltID } } }
  );
  res.json({ status: true });
};

const placerOrder = async (req, res,next) => {
  try {
    const userID = req.session.login._id;
    console.log(req.query);
    console.log(userID + 11111111111);
    let address_id = req.query.addresID;
    req.query.COD;
    const Cart = await cartDb.findOne({ owner: userID });
     let discount=Cart.cartTotal-req.query.amount
    if(!discount){
      discount=0;
    }
   

    const selectAddress = await addressDb.findOne({ user: userID });
    //
 
    let index = selectAddress.address.findIndex((x) => x._id == address_id);

    console.log(index);
    const deliveryAddress = selectAddress.address[index];
    console.log(deliveryAddress);
    if ("COD" == req.query.COD) {
      const creatOrder = await orderDb
        .create({
          date: new Date(),
          buyer: userID,
          products: Cart.items,
          totalPrice:req.query.amount,
          address: deliveryAddress._id,
          orderstatus: "confrim",
          paymentMethod: "Cash On Delivery",
          paymentStatus: "Pending",
          discount:discount
        })
        .then(async (result) => {
          req.session.order = result._id;
          const orderdProducts = result.products;
          
          orderdProducts.forEach(async (element) => {
            let remove = await Product.findOneAndUpdate(
              { _id: element.Product },
              { $inc: { quantity: -element.quantity } }
            );
          });

          console.log("remoced successfullyy");
          let removecart = await cartDb.findOneAndRemove({ owner: userID });
          
        });

      res.json({ status: true });
    } else if ("paypal" == req.query.Paypal) {
      
      const createOrder = await orderDb
        .create({
          date: new Date(),
          buyer: userID,
          products: Cart.items,
          totalPrice: req.query.amount,
          address: deliveryAddress._id,
          orderstatus: "pending",
          paymentMethod: "Paypal",
          paymentStatus: "Pending",
          discount:discount
        })
        .then((result) => {
          req.session.order = result._id;
          res.json({
            //  createOrder,
            amount: result.totalPrice,
            paypal: true,
          });
        });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const onlinePayment = async (req, res,next) => {
  const request = new paypal.orders.OrdersCreateRequest();

  console.log("////////");
  console.log(req.body.items[0].amount);
  const balance = req.body.items[0].amount;

  console.log(balance, "jj");
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: balance,

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: balance,
            },
          },
        },
      },
    ],
  });
  try {
    const order = await paypalCliend.execute(request);

    console.log(order);
    console.log(order.result.id);
    res.json({ id: order.result.id });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const verifyPayment = async (req, res,next) => {
  console.log("payment Verification");
  console.log(req.session.order);
           try {
            const userID = req.session.login._id;
            const orderUpdate = await OrderDB.findOneAndUpdate(
              { _id: req.session.order },
              { $set: { paymentStatus: "Success", orderstatus: "Confirm" } }
            );
            const orderProducts = orderUpdate.products;
            orderProducts.forEach(async (element) => {
              await Product.findOneAndUpdate(
                { _id: element.Product },
                { $inc: { quantity: -element.quantity } }
              );
            });
            let removecart = await cartDb.findOneAndRemove({ owner: userID });
            console.log(orderUpdate);
            res.json({
              order: true,
            });
           } catch (error) {
            console.log(error);
            next(error)
           }

  
};

// }
const orderList = async (req, res,next) => {
  const userID = req.session.login._id;
  let name=res.locals.Username

  try {
    const orderList = await orderDb
    .find({ buyer: userID })
    .populate("products.Product")
    .sort({ createdAt: -1 });

  res.render("user/orderlist", { orderList,name });
  } catch (error) {
    console.log(error);
    next(error)
  }

 
};
const logout = (req, res,next) => {
  req.session.loggedin = null
  req.session.isAuth = null
  res.redirect("/login");
};
const deleteCart = async (req, res,next) => {
  try {
    const userid = req.session.login._id;
  console.log(111111111111111);
  const prodctID = req.query.dltID;
  const Cart = await cartDb.findOne({ owner: userid });
  console.log(Cart);
  let indeX = Cart.items.findIndex((x) => x.Product == prodctID);
  const price = Cart.items[indeX].Price;
  const cart = await cartDb.findOneAndUpdate(
    { owner: userid, "items.Product": prodctID },
    {
      $inc: { cartTotal: -price },
      $pull: {
        items: { Product: prodctID },
      },
    }
  );
  console.log(cart);
  res.json({ deletion: true }); 
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};
const addressManagement = async (req, res,next) => {

  try {
    const allAddress = await addressDb.findOne({user:req.session.login._id});
    console.log(allAddress);
    console.log(33333333333333);
    res.json({
      allAddress,
    });
    
  } catch (error) {
    
  }
};
const editAddres = async (req, res,next) => {
  try {
    const userID = req.session.login._id;
    console.log(req.query.ID);
    console.log(req.body);
    const { fullName, phone, state, area, pinCode, buildingName } = req.body;
    const updateAddress = await addressDb.updateMany(
      { "address._id": req.query.ID },
      {
        $set: {
          "address.$.fullName": fullName,
          "address.$.phone": phone,
          "address.$.state": state,
          "address.$.area": area,
          "address.$.pinCode": pinCode,
          "address.$.buildingName": buildingName,
        },
      }
    );
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const couponChecking = async (req, res,next) => {
   

  try {
    const totalPrice = parseInt(req.query.total);

  let coupon = await couponDB.findOne({ coupenCode: req.body.coupon });
  console.log(coupon);
  const coupenUsed = await couponDB.findOne({
    coupenCode: req.body.coupon,
    users: req.session.login._id,
  });
  if (coupenUsed) {
    res.json({ status: false, message: "INVALID COUPEN" });
  } else {
    if (coupon && coupon.cartValue <= totalPrice) {
      const currentDate = new Date();
      const endDate = coupon.expireDte;

      if (currentDate <= endDate) {
        console.log("coupen    checking");
        const coupenCheck = await couponDB.updateOne(
          { _id: coupon._id },
          { $push: { users: req.session.login._id } }
        );
        console.log("coupen    checked");
        const discount = parseInt(coupon.coupenValue);
        const totalPrize = totalPrice - discount;
        console.log(totalPrize);

        res.json({ status: true, totalPrize, discount });
        console.log(666666666666);
      } else {
        res.json({ status: false, message: "INVALID COUPEN" });
        console.log(2323232323);
      }
    } else {
      res.json({ status: false, message: "INVALID COUPEN" });
      console.log(2323232323);
    }
  } 
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};
const orderInvoice = async (req, res,next) => {
  const userID = req.session.login._id;
  let name=res.locals.Username
  try {
    if (req.query.orderID) {
      const order = await orderDb
        .findById(req.query.orderID)
        .populate("products.Product");
      const selectAddress = await addressDb.findOne({ user: userID });
      let index = selectAddress.address.findIndex((x) => x.id == order.address);
      const deliveryAddress = selectAddress.address[index];
      res.render("user/orderinvoice", { order, deliveryAddress,name });
    } else {
      console.log(req.session.order + "asdasdassadasdas");
      const order = await orderDb
        .findById(req.session.order)
        .populate("products.Product");
      console.log(order);
      const selectAddress = await addressDb.findOne({ user: userID });
  
      let index = selectAddress.address.findIndex((x) => x.id == order.address);
      console.log(index);
      const deliveryAddress = selectAddress.address[index];
      res.render("user/orderinvoice", { order, deliveryAddress,name });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
  
};
const successPage = (req, res,next) => {
  let name=res.locals.Username
  console.log(req.session.login._id);
  res.render("user/success",{name});
};
const addWishlist = async (req, res,next) => {
  const productID = req.query.prdctID;
  const userID = req.session.login._id;

  try {
    const wishList = await wishListDB.findOne({ user: userID });
    if (wishList) {
      const productExist = await wishListDB.findOne({
        user: userID,
        items: productID,
      });
      console.log(productExist + "ithtn tt");
      if (productExist) {
        res.json({ status: false });
        console.log("product exist");
      } else {
        const addWishlist = await wishListDB.updateOne(
          { user: req.session.login._id },
          { $push: { items: productID } }
        );
        console.log("product added");
        res.json({ status: true });
      }
    } else {
      const addWishlist = await wishListDB.create({
        user: userID,
        items: productID,
      });
      console.log("wishlist created");
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};
const wishListView = async (req, res,next) => {
 

  try {
    let name=res.locals.Username
    const allWishlist = await wishListDB
    .findOne({ user: req.session.login._id })
    .populate("items");
  console.log(allWishlist);
  
  res.render("user/wishlist", { allWishlist,name });
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};

const orderView = async (req, res,next) => {
  const userID = req.session.login._id;
  req.query.orderID;
  let name=res.locals.Username
  try {
    const order = await orderDb
    .findById(req.query.orderID)
    .populate("products.Product");
  const selectAddress = await addressDb.findOne({ user: userID });
  let index = selectAddress.address.findIndex((x) => x.id == order.address);
  const deliveryAddress = selectAddress.address[index];
  res.render("user/orders", { order, deliveryAddress,name });
  } catch (error) {
    console.log(error);
    next(error)
  }
  
 
};
const cancelOrder = async (req, res,next) => {
  try {
    const ID = req.body.ID;
    console.log(ID);
    const order = await orderDb.findByIdAndUpdate(ID, {
      orderstatus: "Cancelled",
    });
    orderProduct = order.products;
    orderProduct.forEach(async (element) => {
      let update = await Product.findByIdAndUpdate(
        { _id: element.Product },
        { $inc: { quantity: element.quantity } }
      );
    });
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    next(error)
  }
 
};
const editProfile=async(req,res,next)=>{
  try {

   ID=req.body.userID
  
   const update=await User.findByIdAndUpdate(ID,{
    
      name:req.body.name,
      email:req.body.email
    }
   )
   console.log(1212121212121212);
   res.json({update:true});
  } catch (error) {
    console.log(error);
    next(error)
  }

 }
   
 const search=async(req,res,next)=>{

 try {
  
   const searchResult=[]
   const searchProducts=[]
   const searchData=req.body.value
   console.log(searchData);
   const regex = new RegExp('^' + searchData + '.*', 'i')
   const searchProduct=await Product.aggregate([
     {
       $match:{$or:[{name:regex},{discription:regex}]}
     }
   ])
   console.log(searchProduct);
   searchProduct.forEach(element => {
     searchResult.push({name:element.name})
     
   });
   for (let i = 0; i <searchProduct.length; i++) {
     searchProducts.push(searchProduct[i])
     
   }

 console.log(searchProducts);
   console.log(searchResult);
   res.json({status:true,searchResult,searchProducts})
 } catch (error) {
  console.log(error);
    next(error)
 } 



 }
 const blog=(req,res)=>{
  let count = res.locals.count;
  let name=res.locals.Username
  let wishlistCount = res.locals.wishlistCount;
  res.render("user/blog",{count,name,wishlistCount})
 }
 const contact=(req,res)=>{
  let count = res.locals.count;
  let name=res.locals.Username
  let wishlistCount = res.locals.wishlistCount;
  res.render("user/contact",{count,name,wishlistCount})
 }


module.exports = {
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
  orderInvoice,
  successPage,
  addWishlist,
  wishListView,
  onlinePayment,
  verifyPayment,
  orderView,
  cancelOrder,
  editProfile,
  search,
  contact,
  blog,
 
};
