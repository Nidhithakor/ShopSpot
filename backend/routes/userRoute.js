import express from 'express'
import {
  loginUser,
  registerUser,
  adminLogin,
  allUser,
  removeUser,
  updateprofile,
  updateUserRole
} from "../controllers/userController.js";
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/admin',adminLogin);
userRouter.post('/all' , allUser);
userRouter.post('/remove' , removeUser);
userRouter.put("/updateprofile",authUser, updateprofile);
userRouter.put("/updaterole",  authUser, updateUserRole);
export default userRouter;
