const express = require('express');
const {authorizeRoles,isAuthenticatedUser}=require('../Middleware/auth')
const {createCategory,deleteCategory,getAdminCategories,getAllCategories,getCategoriesDetails,updateCategory}=require('../Controllers/categoryController')


const router = express.Router();


router.get("/categorys",getAllCategories)

router.get("/admin/categorys",isAuthenticatedUser, authorizeRoles("admin"),getAdminCategories)

router.get("/category/:id",isAuthenticatedUser, authorizeRoles("admin"),getCategoriesDetails)


router.post("/admin/category/new",isAuthenticatedUser, authorizeRoles("admin"),createCategory)

router.put("/admin/category/:id",isAuthenticatedUser, authorizeRoles("admin"),updateCategory)

router.delete("/admin/category/:id",isAuthenticatedUser, authorizeRoles("admin"),deleteCategory)







module.exports = router;