const express = require('express');
const {authorizeRoles,isAuthenticatedUser}=require('../Middleware/auth')
const ProductController=require('../Controllers/productController')


const router = express.Router();

router.get("/products",ProductController.getAllProducts)

router.get("/admin/products",isAuthenticatedUser, authorizeRoles("admin"),ProductController.getAdminProducts)

router.post("/admin/product/new",isAuthenticatedUser, authorizeRoles("admin"),ProductController.createProduct)

router.put("/admin/product/:id",isAuthenticatedUser, authorizeRoles("admin"),ProductController.updateProduct)

router.delete("/admin/product/:id",isAuthenticatedUser, authorizeRoles("admin"),ProductController.deleteProduct)

router.get("/product/:id",ProductController.getProductDetails)

router.put("/review",isAuthenticatedUser,ProductController.createProductReview)

router.get("/reviews",ProductController.getProductReviews)

router.delete("/reviews",isAuthenticatedUser,ProductController.deleteReview)






module.exports = router;