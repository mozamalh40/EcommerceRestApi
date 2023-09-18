const Order = require("../Models/orderModel");
const Product=require('../Models/productModels');
const ErrorHander = require('../utils/ErrorHandler');
const catchAsyncError = require("../Middleware/catchAsyncErrors");


//create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});


//get single order details by user//
exports.getSingleOrder=catchAsyncError( async(req,res,next)=>{
    const order= await Order.findById(req.params.id).populate(
      //populate ka mtlb haa k jb hm order create karen ga toh user ki id b milla gi hamma toh wo user ma jaya ga jaha user store haa mongodb ma toh wo waha usa uska name or email utha ly ga  
      "user","name email")

    if(!order){
        return next(ErrorHander("order not found with id",404))
    }
    res.status(200).json({
        success:true,
        order,
    })
})



  //get logined in user  order//
  exports.myOrders=catchAsyncError( async(req,res,next)=>{
      //mtlb k wo orders ma dundha ga sara order ussa milla ga thk haa..phr user:req.user._id ka mtlb jo user logind haa uski jo id sa orders diya gaya haa wo sb
      const orders= await Order.find({user:req.user._id})

      res.status(200).json({
          success:true,
          orders,
      })
  })

    //get all  orders by--admin//
    exports.getAllOrders=catchAsyncError( async(req,res,next)=>{
      const orders= await Order.find()
      let totalAmout=0;
      orders.forEach((order) => {
          totalAmout+=order.totalPrice;
      });

      res.status(200).json({
          success:true,
          totalAmout,
          orders,
      })
  })




//   update order status --admin////////////////////////////////////////////////
     exports.updateOrder=catchAsyncError( async(req,res,next)=>{
       const order= await Order.findById(req.params.id)
       if(!order){
        return next(new ErrorHander("order not found with id",404))
    }
///ya neacha wali if ma check karra ga k order status kiaa haa.. agr delivered htoh ya chala gi
if(order.orderStatus==="Delivered"){
   return next(new ErrorHander("you hava already delivered this order",404))
}
if(req.body.status==="Shipped"){
order.orderItems.forEach(async (order)=>{
  await updateStock(order.product,order.quantity)
})
}
order.orderStatus=req.body.status
// ya neacha wali if iss liya haa k jb hm oderStatus baja ga k delivered
if(req.body.status==="Delivered"){
   order.deliveredAt=Date.now()
}
await order.save({validateBeforeSave:false})
 res.status(200).json({
     success:true,
    })
})

async function updateStock(id,quantity){
 const product = await Product.findById(id);
     product.Stock-=quantity
    await product.save({validateBeforeSave:false})

}


  //delete order by--admin//
  exports.deleteOrder=catchAsyncError( async(req,res,next)=>{
    const order= await Order.findById(req.params.id)
    if(!order){
      return next(new ErrorHander("order not found with id",404))
  }
    await order.remove()

    res.status(200).json({
        success:true,
    
    })
})
