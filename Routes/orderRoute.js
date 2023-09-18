const express = require('express');
const {authorizeRoles,isAuthenticatedUser}=require('../Middleware/auth')
const orderController=require('../Controllers/orderController')


const router = express.Router()

router.post('/order/new' ,isAuthenticatedUser,orderController.newOrder)

router.get('/order/:id' ,isAuthenticatedUser,orderController.getSingleOrder)

router.get('/orders/me' ,isAuthenticatedUser,orderController.myOrders)

router.get('/admin/orders',isAuthenticatedUser, authorizeRoles("admin"),orderController.getAllOrders)

router.put('/admin/order/:id',isAuthenticatedUser, authorizeRoles("admin"),orderController.updateOrder)

router.delete('/admin/order/:id',isAuthenticatedUser, authorizeRoles("admin"),orderController.deleteOrder)




module.exports = router