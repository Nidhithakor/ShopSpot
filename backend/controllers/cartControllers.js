import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    //  console.log("Request body:", req.body);
    //  console.log("Authenticated user:", req.user);
    const {  itemId, size } = req.body;
    const userId = req.user.id; 

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

   const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData },{new: true});


    res.json({
      success: true,
      message: "Added To Cart",
      cartData: updatedUser.cartData,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update  user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    // Consider checking if cartData[itemId] exists before accessing it
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity;
    } else {
      // Optionally handle if the item/size doesn't exist
      return res
        .status(400)
        .json({ success: false, message: "Item not in cart" });
    }

    // cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    
 const userId = req.user.id;
    // const { userId } = req.body;
    
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
