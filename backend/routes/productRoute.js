import express from 'express'
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  addReviewProduct,
  getProductReviews,
  getSellerProducts,
  getSellerProductReviews,
  AdminReviews,
  deleteReview,
} from "../controllers/productController.js";
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post(
  "/add",authUser,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post('/remove',removeProduct);
productRouter.post("/single", adminAuth, singleProduct);
productRouter.get("/list",  listProducts);
productRouter.post("/add-review/:productId", authUser, addReviewProduct);
productRouter.get("/:productId/reviews", getProductReviews);
productRouter.get("/seller-products", authUser, getSellerProducts);
productRouter.get("/seller-reviews", authUser, getSellerProductReviews);
productRouter.delete(
  "/reviews/delete/:productId/:reviewId",
  authUser,
  deleteReview
);

productRouter.get("/reviews", authUser, AdminReviews);
export default productRouter;


