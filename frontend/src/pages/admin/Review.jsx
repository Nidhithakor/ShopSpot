import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminReviews = () => {
  const [groupedReviews, setGroupedReviews] = useState({});
  import { backendUrl } from "../../context/ShopContext";

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/reviews`, {
        headers: {
          token: localStorage.getItem("token"), 
        },
      });

      if (response.data.success) {
        // Group reviews by product
        const grouped = response.data.reviews.reduce((acc, review) => {
          if (!acc[review.productName]) {
            acc[review.productName] = {
              productImage: review.productImage,
              reviews: [],
            };
          }
          acc[review.productName].reviews.push(review);
          return acc;
        }, {});
        setGroupedReviews(grouped);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews");
    }
  };

  // Delete a review (Only Admin can perform this)
  const deleteReview = async (productId,reviewId) => {

  //  console.log(productId, reviewId);
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/product/reviews/delete/${productId}/${reviewId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (response.data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews(); // Refresh the reviews
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Manage Product Reviews
      </h2>

      {Object.keys(groupedReviews).length === 0 ? (
        <p className="text-center">No reviews found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Product Image</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Reviewer</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedReviews).map(
              ([productName, { productImage, reviews }], index) =>
                reviews.map((review, reviewIndex) => (
                  <tr key={reviewIndex} className="text-center">
                    {reviewIndex === 0 && (
                      <>
                        <td rowSpan={reviews.length} className="border p-2">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-16 h-16 object-cover mx-auto rounded"
                          />
                        </td>
                        <td
                          rowSpan={reviews.length}
                          className="border p-2 font-semibold"
                        >
                          {productName}
                        </td>
                      </>
                    )}
                    <td className="border p-2 text-blue-600 font-bold">
                      {review.username}
                    </td>
                    <td className="border p-2">{review.rating} ⭐</td>
                    <td className="border p-2">{review.comment}</td>
                    <td className="border p-2">
                      {new Date(review.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          deleteReview(review.productId, review._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviews;
