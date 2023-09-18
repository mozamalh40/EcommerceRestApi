
const Product=require('../Models/productModels');
const catchAsyncError = require("../Middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require('../utils/ErrorHandler');
const cloudinary = require("cloudinary");


///create Product--admin

exports.createProduct=catchAsyncError(async (req,res,next)=>{
  //ya neacha haa k agr user na ak he image di toh ussa images wali array ma push krdo agr zada haa toh images wali array ko wasa he req.body k equal krdiya usma push hojaya gi
  
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
  //  ya neacha walli line iss liya haa k jo b user product create karra ga ya uski id la k dyga 
  // ya iss liya haa k pata chala kis user na product create ki
      req.body.user=req.user.id
  //this is for product create
      const product=await Product.create(req.body)
    
      res.status(201).json({
          success:true,
          product
      })
    })
  //get all products
  
  exports.getAllProducts=catchAsyncError(async (req,res)=>{
   
      const resultPerPage=8
      const productsCount=await Product.countDocuments()
  const apifeature= new ApiFeatures(Product.find(),req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
      const products= await apifeature.query 
      res.status(201).json({
       success:true,
       products,
       productsCount,
       resultPerPage,
   })
   })
  
   //get all products --admin
  
  exports.getAdminProducts=catchAsyncError(async (req,res)=>{
   const products=await Product.find()
  
    res.status(201).json({
     success:true,
     products,
  
  })
  })
  
  
  //update product--admin
  
  exports.updateProduct=async (req,res,next)=>{
      try {
          let product= await Product.findById(req.params.id) 
  
  
     //ya neacha haa k agr user na ak he image di toh ussa images wali array ma push krdo agr zada haa toh images wali array ko wasa he req.body k equal krdiya usma push hojaya gi
          
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  //mtlb k image jo haa undefiend nai hui mtlb k image exist krti haa toh purani images cludnary sa delete krni haa ak ak kr k iss liya loop chala
    if (images!==undefined){
      for (let i = 0; i < product.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
       
     }
     const imagesLinks = [];
  //ya neacha new images cloudnary per upload krna k liya
     for (let i = 0; i < images.length; i++) {
       const result = await cloudinary.v2.uploader.upload(images[i], {
         folder: "products",
       });
   
       imagesLinks.push({
         public_id: result.public_id,
         url: result.secure_url,
       });
     }
     req.body.images=imagesLinks
    }
    //simple product update
      product= await Product.findByIdAndUpdate(req.params.id,{
          $set:req.body
      },{new:true})
      res.status(201).json({
          success:true,
          product
      }) 
      } catch (err) {
          return next (new ErrorHander("product not found",404))   
      }
   
   }
   //get single product deltail
   exports.getProductDetails=catchAsyncError(async(req,res,next)=>{
  const product =await Product.findById(req.params.id);
  if(!product){
    return next(new ErrorHander("product not found",404));
  }
  res.status(200).json({
    success:true,
    product
  })
   })
  
   //delete product 
  
   exports.deleteProduct= async (req,res,next)=>{
       try {
          const product = await Product.findById(req.params.id)
   
          await product.remove()
     
          res.status(200).json({
              success:true,
              message:"product is delete"
          }) 
          //deleting images
          for (let i = 0; i < product.length; i++) {
             await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            
          }
       } catch (err) {
          return next (new ErrorHander("product not found",404))   
           
      }
  }
  
  
  
  
  //  create new review and update the review
   exports.createProductReview = catchAsyncError(async (req, res, next) => {
      const { rating, comment, productId } = req.body;
    
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };
    
      const product = await Product.findById(productId);
    
      const isReviewed = product.reviews.find(
          
   //ya neaha wali line ka balla kiaa mtlb mtlb ya haa k (rev) ma hamma ak ak kr k review milla ga jis user na review create kiaa haa uski id or jo user login haa uski matcch kr jaya toh mtlb review pahla sa he create haa
        (rev) => rev.user.toString() === req.user._id.toString()
      );
    
      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
      } else {
          //product schema ma jo reviews ki arry banni thi us ma upper jo review bannaya haa ussa push kiya haa
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }
    
      let avg = 0;
    
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
     
    
      product.ratings = avg / product.reviews.length;
    
      await product.save({ validateBeforeSave: false });
    
      res.status(200).json({
        success: true,
      });
    });
  
    // Get All Reviews of a product
  exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });