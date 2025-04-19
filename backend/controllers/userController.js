import validator from 'validator'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import mongoose from 'mongoose';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{expiresIn : '7d'});
}

// Route to get all user for admin panel

const allUser =  async (req,res) => {
   try {
     const users = await userModel.find({});

     const userCount = await userModel.countDocuments();

     res.json({ success: true, userCount, users });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }

}

// route to delete user from admin panel
const removeUser = async (req,res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "User Removed!!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// route to update user profile.
// const updateprofile = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const userId = req.user.id;

//     // Update user in database
//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { name, email },
//       { new: true }
//     );


//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }


//      res.json({
//        success: true,
//        message: "Profile updated successfully",
//        user: updatedUser,
//      });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };



const updateprofile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id; // ✅ Ensure `req.user.id` is properly assigned

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    // Update user in database
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Route for user login
const loginUser = async (req,res) => {

    try {
        
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if(!user) {
            return res
              .status(401)
              .json({ success: false, message: "Incorrect email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

       
        if(isMatch) {
            const role = user.role; 
            const name = user.name;
            const email = user.email;
            const userId = user._id;
            const token = createToken(user._id);
            res.json({
              success: true,
              token,
              role: user.role,
              name: user.name,
              email: user.email,
              userId,
            });

        } else {
            res.json({success:false, message:"Invalid crefentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }


}



// Route for user register
const registerUser = async (req,res) => {

    try {
        
        const {name, email, password} = req.body;
        
        // checking user already exist or not
        const exists = await userModel.findOne({email});
        if(exists) {
            return res.json({success : false, message:"User Already Exists !!"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)) {
             return res.json({
               success: false,
               message: "Please Enter a valid email !!",
             });
        }

        if (password.length < 8) {
          return res.json({
            success: false,
            message: "Please enter a strong password !!",
          });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
          name,
          email,
          password: hashedPassword,
          role: "user",
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }

}
// const updateUserRole = async (req, res) => {
//   try {
//     const { userId, role } = req.body;

//     // Ensure only admins can update roles
//     // if (req.user.role !== "admin") {
//     //   return res
//     //     .status(403)
//     //     .json({ success: false, message: "Unauthorized action" });
//     // }

//     // Validate role (only allow "user" or "admin")
//     // if (!["user", "admin"].includes(role)) {
//     //   return res.status(400).json({ success: false, message: "Invalid role" });
//     // }

//     // Update user role in the database
//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId,
//       { role },
//       { new: true }
//     );

//     // if (!updatedUser) {
//     //   return res
//     //     .status(404)
//     //     .json({ success: false, message: "User not found" });
//     // }

//     res.json({
//       success: true,
//       message: "User role updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Route for admin login


const updateUserRole = async (req, res) => {
  try {
    let { userId, role } = req.body;

    // Ensure only admins can update roles
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Unauthorized action" });
    // }

    // Validate role (allow only "user", "admin", or "seller")
    // const validRoles = ["user", "admin", "seller"];
    // if (!validRoles.includes(role)) {
    //   return res.status(400).json({ success: false, message: "Invalid role" });
    // }

    // Convert userId to ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    // Update user role in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId), // ✅ Ensure it's an ObjectId
      { role },
      { new: true }
    );

    // Check if user exists
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user role" });
  }
};


const adminLogin = async (req,res) => {

    try {
        
        const {email, password} = req.body;

        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          const token = jwt.sign({email}, process.env.JWT_SECRET);
          res.json({ success: true, token });
        } else {
          res.json({ success: false, message: "Invalid credentials!!" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}




export {
  updateprofile,
  updateUserRole,
  loginUser,
  registerUser,
  adminLogin,
  allUser,
  removeUser,
}; 