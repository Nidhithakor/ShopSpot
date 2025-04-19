import { v2 as cloudinary} from 'cloudinary';
// import { json } from 'express';
import productModel from '../models/productModel.js';


// function for add product
const addProduct = async (req,res) => {

try {
    const sellerId = req.user.id;
    // console.log(sellerId);
    // console.log("User Info:", req.user.id); 
    const {
      
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      quantity,
    } = req.body;


    const image1 = req.files?.image1 && req.files?.image1?.[0];
    const image2 = req.files?.image2 && req.files?.image2?.[0];
    const image3 = req.files?.image3 && req.files?.image3?.[0];
    const image4 = req.files?.image4 && req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});

          return result.secure_url;
      })
    )

   const productData = {
    sellerId,
    name,
    description,
    category,
    price:Number(price),
    subCategory,
    bestseller: bestseller === 'true' ? true :false,
    sizes:JSON.parse(sizes),
    image: imagesUrl,
    quantity,
    date: Date.now()
   }

  //  console.log(productData);

   const product = new productModel(productData);

   await product.save();

    res.json({success:true,message:"Product Added!!"});

} catch (error) {
  console.log(error);
    res.json({success:false, message:error.message});
}  

}


// function for list product
const listProducts = async (req,res) => {

    try {
      
      const products = await productModel.find({});
      const productCount = await productModel.countDocuments();
      res.json({success:true,productCount, products});

    } catch (error) {
      console.log(error);
       res.json({ success: false, message: error.message });
    }


}

// function for remove product
const removeProduct = async (req,res) => {

  try {
    
    await productModel.findByIdAndDelete(req.body.id);

    res.json({success:true, message:"Product Removed!!"});

  } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
  }

}

// function for single product info
const singleProduct = async (req,res) => {

  try {

    const {productId} = req.body;
    const product = await productModel.findById(productId);

    res.json({success:true, product});

  } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
  }

}

// add a product review

const addReviewProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId, username, rating, comment } = req.body; // 👈 Get from body

  if (!userId || !username) {
    return res
      .status(400)
      .json({ error: "User ID and username are required." });
  }

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const newReview = {
      userId,
      username,
      rating,
      comment,
      date: new Date(),
    };

    product.reviews.push(newReview);
    await product.save();

    res
      .status(201)
      .json({ message: "Review added successfully!", review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Function to get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find the product by ID
    const product = await productModel.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Return product reviews
    res.json({ success: true, reviews: product.reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id; // Get seller ID from the authenticated user

    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const products = await productModel.find({ sellerId }); // ✅ Filters by sellerId

    res.json({
      success: true,
      productCount: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSellerProductReviews = async (req, res) => {
  try {
    const sellerId = req.user.id; // Get logged-in seller's ID

    // Fetch products added by this seller
    const sellerProducts = await productModel
      .find({ sellerId })
      .select("_id name image reviews");

    if (!sellerProducts.length) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    let formattedReviews = [];

    // Loop through each product and populate the reviews' userId field
    for (const product of sellerProducts) {
      // Populate the userId field from the reviews array
      await product.populate("reviews.userId", "name");

      product.reviews.forEach((review) => {
        formattedReviews.push({
          productName: product.name,
          productImage: product.image[0], // First image
          username: review.userId ? review.userId.name : "Unknown", // ✅ Fetch name dynamically from user model
          rating: review.rating,
          comment: review.comment,
          date: review.date,
        });
      });
    }

    res.json({ success: true, reviews: formattedReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

const AdminReviews = async (req,res) => {
try {
    const reviews = await productModel.find({}, { reviews: 1, name: 1, image: 1 })
      .populate("reviews.userId", "name"); // Fetch user details

    let formattedReviews = [];
    reviews.forEach((product) => {
      product.reviews.forEach((review) => {
        formattedReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          productImage: product.image[0],
          username: review.userId ? review.userId.name : "Unknown",
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          approved: review.approved || false,
        });
      });
    });

    res.json({ success: true, reviews: formattedReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
}

// allowing admin to delete reviews 


// const AdminReviews = async (req, res) => {
//   try {
//     // Fetch products with their reviews and names
//     const products = await productModel
//       .find({}, { reviews: 1, name: 1, image: 1 })
//       .populate("reviews.userId", "name"); // Fetch user details

//     // Formatting reviews for frontend
//     let formattedReviews = [];
//     products.forEach((product) => {
//       product.reviews.forEach((review) => {
//         formattedReviews.push({
//           _id: review._id, // Review ID
//           productId: product._id, // Ensure product ID is included
//           productName: product.name,
//           productImage: product.image[0] || "", // Ensure it doesn’t break if no image
//           username: review.userId ? review.userId.name : "Unknown",
//           rating: review.rating,
//           comment: review.comment,
//           date: review.date,
//           approved: review.approved || false,
//         });
//       });
//     });

//     return res.json({ success: true, reviews: formattedReviews, productId });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch reviews" });
//   }
// };

const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    console.log("Deleting review" ,{productId,reviewId});
    // Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
console.log(product);
    // Check if the review exists
    const reviewIndex = product.reviews.find(
      (rev) => rev.id.toString() === reviewId
    );
    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    console.log(reviewIndex);
    // Remove the review from the array
    product.reviews.splice(reviewIndex, 1);

    // Save the updated product document
    await product.save();

    return res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export {
  getSellerProducts,
  addReviewProduct,
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  getProductReviews,
  getSellerProductReviews,
  AdminReviews,
  deleteReview,
};



