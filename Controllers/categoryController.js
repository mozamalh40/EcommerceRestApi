const Category =require('../Models/categoryModel')
const Product=require('../Models/productModels');
const catchAsyncError = require("../Middleware/catchAsyncErrors");
const ErrorHander = require('../utils/ErrorHandler');


// get All Categories
exports.getAllCategories=catchAsyncError(async (req,res,next)=>{
  const categorys = await Category.find()
  res.status(201).json({
      success: true,
      categorys
    });

  return next(new ErrorHander("Product not found", 500));
  
    })


   //get all products --admin
   exports.getAdminCategories=catchAsyncError(async (req,res,next)=>{
    const categories = await Category.find()
    res.status(201).json({
        success: true,
        categories
      });

    return next(new ErrorHander("Product not found", 500));
    
      })



    exports.getCategoriesDetails=catchAsyncError(async (req,res,next)=>{
      const category = await Category.findById(req.params.id)
      res.status(201).json({
          success: true,
          category
        });
  
      return next(new ErrorHander("Product not found", 500));
      
        })
exports.createCategory=catchAsyncError(async (req,res,next)=>{
      const {name} = req.body;
          const category = await Category.findOne({name})
          if(category)   return next(new ErrorHander("This category already exists.", 400));

          const newCategory = new Category({name})

          await newCategory.save()
          res.status(201).json({
              success: true,
           
            });
  
      return next(new ErrorHander("Product not create", 500));
      
        })


exports.  deleteCategory=catchAsyncError(async (req,res,next)=>{
          const products = await Product.findOne({category: req.params.id})
          if(products)   return next(new ErrorHander("Please delete all products with a relationship.", 400));

          await Category.findByIdAndDelete(req.params.id)
          res.status(201).json({
              success: true,
    
            });
      
          return next(new ErrorHander("Product not deleted", 500));
          
            })



exports.updateCategory=catchAsyncError(async (req,res,next)=>{
              const {name} = req.body;
              await Category.findOneAndUpdate({_id: req.params.id}, {name})
  
              res.status(201).json({
                  success: true,
        
                });
          
              return next(new ErrorHander("Product not updated", 500));
              
                })