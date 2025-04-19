import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { backendUrl } from './admin/List';
import Title from '../components/Title';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const { token, navigate } = useContext(ShopContext);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // console.log(item);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId]);

  // Fetch reviews from backend
 const fetchReviews = async () => {
   try {
     const response = await axios.get(
       `${backendUrl}/api/product/${productId}/reviews`
     );
     setReviews(response.data.reviews);

    //  console.log(response);

     // Calculate and update average rating
     if (response.data.length > 0) {
       const avg =
         response.data.reduce((sum, review) => sum + review.rating, 0) /
         response.data.length;
       setAverageRating(avg.toFixed(1));
     } else {
       setAverageRating(0);
     }
   } catch (error) {
     console.error("Error fetching reviews:", error);
   }
 };


  // Submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const storedName = localStorage.getItem("name");
    const storedUserId = localStorage.getItem("userId");


    if (!token) {
      alert("You must be logged in to leave a review.");
      return;
    }
    const reviewData = {
       userId:storedUserId  ,
       username:storedName , 
      rating,
      comment,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/add-review/${productId}`, 
        reviewData,
        {
          headers: {
            token
          
          },
        }
      );

      console.log(response);
      if (response.status === 201) {
        alert("Review added successfully!");
        setReviews([...reviews, response.data.review]); 
        setComment("");
        fetchReviews(); // Refresh reviews after submission
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };



  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 sm:flex-row">
        {/* --------------- Product Images ---------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full ">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* ------------------ Product Info ------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3 5" src={assets.star_icon} alt="" />
            <img className="w-3 5" src={assets.star_icon} alt="" />
            <img className="w-3 5" src={assets.star_icon} alt="" />
            <img className="w-3 5" src={assets.star_icon} alt="" />
            <img className="w-3 5" src={assets.star_dull_icon} alt="" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium ">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Reviews & Description Toggle Section */}
      <div className="mt-20 flex">
        <button
          className={`border px-5 py-3 text-sm ${
            activeTab === "description" ? "bg-gray-200" : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={`border px-5 py-3 text-sm ${
            activeTab === "reviews" ? "bg-gray-200" : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* Show Description or Reviews based on activeTab */}
      {activeTab === "description" ? (
        <div className="border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that faciliates the
            buying and selling of products or services over the internet. It
            serve as a virtual marketplace where bussinesses and individual cart
            showcase their product, interact with cutomers, and conduct
            transaction without the need for physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility and, the global reach they offer.
          </p>
          <p className="mt-2">
            E-commerce websites typically display products or service along with
            detailed description, images, prices and any available varients
            (e.g. sizes, colrs). Each product usually has its own detailed page
            with relevent information.
          </p>
        </div>
      ) : (
        <div className="border px-6 py-6 text-sm text-gray-500">
          {/* <h3 className="text-lg font-semibold text-black">Add Review</h3> */}
          <div className='text-2xl'>
            <Title text1="Add" text2=" Review"/>
          </div>
          <form
            onSubmit={handleReviewSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <label>Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ⭐
                </option>
              ))}
            </select>

            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2"
              required
            />

            <button
              type="submit"
              onClick={handleReviewSubmit}
              className="bg-black text-white px-6 py-2 w-40"
            >
              Submit Review
            </button>

            <h3 className="text-lg font-semibold text-black">
              Customer Reviews
            </h3>

          </form>
          <div className="mt-2 d-flex items-start">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-3 mb-3">
                  <span className="mr-2 text-black">
                    ⭐{Number(review.rating)}
                  </span>
                  <span className="text-black">{review.username}</span>

                  <p className="text-black">{review.comment}</p>
                  <small>{new Date(review.date).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      )}

      {/* -------------display related products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}

export default Product

