import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'
import mongoose from "mongoose";

//global variables
const currency = 'inr';
const deliveryCharge = 10;

// gateway initialize

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// placing orders using COD Method
const placeOrder = async (req,res) => {

    try {

      console.log("body",req.body);

       const userId = req.user.id;
        const { sellerId, items, amount, address, date } = req.body;

      if (!sellerId) {
        // Optionally, derive sellerId from the first product's seller or return an error.
        return res
          .status(400)
          .json({ success: false, message: "Seller ID is required" });
      }

        const orderData = {
          userId,
          sellerId,
          items,
          address,
          amount,
          paymentMethod: "COD",
          payment: false,
          date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId , {cartData:{}});

        res.json({suceess : true , message : 'Order Placed '})


    } catch (error) {
        console.log("User Info:", req.user); 
        console.log(error);
        res.json({success:false, message : error.message});
    }

}

// placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {

}

// placing orders using Razorpay Method
// const placeOrderRazorpay = async (req,res) => {
// //  console.log("User Info:", req.user); 

//   try {
//     const userId = req.user.id;
//       const { items , amount, address} = req.body;
    

//       const orderData = {
//         userId,
//         items,
//         address,
//         amount,
//         paymentMethod:"Razorpay",
//         payment:false,
//         date:Date.now()
//       }

//       const newOrder = new orderModel(orderData);
//       await newOrder.save();


//       // console.log(newOrder);
//       const options = {
//         amount : amount * 100,
//         currency : currency.toUpperCase(),
//         receipt : newOrder._id.toString()
//       }

//       await razorpayInstance.orders.create(options, (error, order) => {
//           if(error) {
//             console.log(error);
//             return res.json({success:false, message:error});
//           }
//            res.json({ success: true, order });
//       })    

//   } catch (error) {
//     console.log(error);
//     res.json({success:false, message:error.message});
//   }

// }

const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id; // Use _id instead of id
    const { items, amount, address, currency } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    const sellerId = items[0]?.sellerId || null; // Get sellerId from first item

    const orderData = {
      userId,
      sellerId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency: (currency || "INR").toUpperCase(), // Default to INR
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(orderOptions);

    res.json({ success: true, order: razorpayOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyRazorpay = async (req,res) => {

  try {
    
    const {userId, razorpay_order_id } = req.body

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo);

    if(orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment : true});

      await userModel.findByIdAndUpdate(userId , {
        cartData : {}
      })

     res.json({success : true , message : 'Payment Successful'}) 
    } else {
      res.json ({success:false , message:'Payment Failed'})
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}

// All orderes data for admin pannel
const allOrers = async (req, res) => {

    try {

        const orders = await orderModel.find({})
        const orderCount = await orderModel.countDocuments();

        res.json({ success: true,totalOrders: orderCount, orders,  });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// user Order data for frontend page myorders
const userOrders = async (req, res) => {
  try {
    //  console.log("Request body:", req.body); // Debugging

     
    const  userId  = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // console.log("Received userId:", userId); 

    // Convert userId to ObjectId if necessary
    const orders = await orderModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Ensure orderId and status are provided
    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    // Find and update the order status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Returns the updated document
    );

    // If order is not found
    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



const getSellerOrders = async (req, res) => {
  try {
    const  sellerId  = req.user.id;;

    //  sellerId = req.user._id; // ✅ Get seller ID from the authenticated user

    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Find orders where at least one item is sold by this seller
    const orders = await orderModel.find({ "items.sellerId": sellerId });

    res.json({
      success: true,
      orderCount: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


// allow admin to add / update expected delivery date 

// const updateDeliveryDate = async (req, res) => {
//   try {
//     const { orderId, expectedDeliveryDate } = req.body;

//     if (!orderId || !expectedDeliveryDate) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }

//     // Ensure only the seller who owns the order can update it
//     // if (
//     //   req.user.role !== "seller" ||
//     //   req.user._id.toString() !== order.sellerId.toString()
//     // ) {
//     //   return res.status(403).json({ success: false, message: "Unauthorized" });
//     // }

//     order.expectedDeliveryDate = new Date(expectedDeliveryDate);
//     await order.save();

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Expected delivery date updated",
//         order,
//       });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const updateDeliveryDate = async (req,res) => {
  try {
    const { orderId, expectedDeliveryDate } = req.body;

    if (!orderId || !expectedDeliveryDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const formattedDate = new Date(expectedDeliveryDate)
      .toISOString()
      .split("T")[0];

    const result = await orderModel.updateOne(
      { _id: orderId },
      { expectedDeliveryDate: formattedDate }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Delivery date updated successfully" });
  } catch (error) {
    console.error("Error updating delivery date:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}



export {
  updateDeliveryDate,
  verifyRazorpay,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrers,
  userOrders,
  updateStatus,
  getSellerOrders,
};

