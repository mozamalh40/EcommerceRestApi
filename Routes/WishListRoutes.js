const express = require('express');
const {isAuthenticatedUser}=require('../Middleware/auth')
const {
    addToWishlist,
    getWishlistData,
    removeWishlistData,
    addToCart,
    getCartData,
    updateCart,
    removeCartData,
  } = require("../Controllers/CartController.js");


const router = express.Router();

router.get("/wishlist",getWishlistData)

router.post("/addToWishlist",isAuthenticatedUser, addToWishlist)

router.delete("/removeWishlist/:id",isAuthenticatedUser, removeWishlistData)

router.post("/addToCart",isAuthenticatedUser, addToCart)

router.get("/cart",isAuthenticatedUser, getCartData)

router.put("/cart/update/:id",isAuthenticatedUser, updateCart)

router.delete("/removeCart/:id",isAuthenticatedUser, removeCartData)





module.exports = router;