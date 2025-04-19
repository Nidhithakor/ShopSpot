import express from 'express'

import {placeOrder,updateDeliveryDate, placeOrderStripe,getSellerOrders, placeOrderRazorpay, allOrers, userOrders, updateStatus, verifyRazorpay } from '../controllers/orderControllers.js';
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list' , allOrers);
orderRouter.get("/seller-orders",authUser, getSellerOrders); 

// Payment features 
orderRouter.post('/place', authUser , placeOrder);
orderRouter.post('/stripe', authUser , placeOrderStripe);
orderRouter.post('/razorpay', authUser , placeOrderRazorpay);
orderRouter.post("/update-delivery-date", authUser, updateDeliveryDate);


// User feature
orderRouter.post('/userorders' , authUser, userOrders);

// verify payment
orderRouter.post('/verifyRazorpay' , authUser , verifyRazorpay);

export default orderRouter;

