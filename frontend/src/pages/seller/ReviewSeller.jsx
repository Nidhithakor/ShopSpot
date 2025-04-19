

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const SellerReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const backendUrl = "http://localhost:4000"; // Update with your backend URL

//   // Fetch seller's product reviews
//   const fetchSellerReviews = async () => {
//     try {
//       const response = await axios.get(
//         `${backendUrl}/api/product/seller-reviews`,
//         {
//           headers: {
//             token: localStorage.getItem("token"), // Ensure seller authentication
//           },
//         }
//       );

//       console.log(response);

//       if (response.data.success) {
//         setReviews(response.data.reviews);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch reviews");
//     }
//   };

//   useEffect(() => {
//     fetchSellerReviews();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">Product Reviews</h2>

//       {reviews.length === 0 ? (
//         <p className="text-center text-gray-600">
//           No reviews found for your products.
//         </p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border p-2">Product Image</th>
//                 <th className="border p-2">Product Name</th>
//                 <th className="border p-2">Reviewer</th>
//                 <th className="border p-2">Rating</th>
//                 <th className="border p-2">Comment</th>
//                 <th className="border p-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reviews.map((review, index) => (
//                 <tr key={index} className="text-center hover:bg-gray-100">
//                   <td className="border p-2">
//                     <img
//                       src={review.productImage}
//                       alt={review.productName}
//                       className="w-16 h-16 object-cover mx-auto rounded-lg shadow-sm"
//                     />
//                   </td>
//                   <td className="border p-2 font-medium">
//                     {review.productName}
//                   </td>
//                   <td className="border p-2 font-semibold text-blue-600">
//                     {review.username}
//                   </td>
//                   <td className="border p-2 text-yellow-500">
//                     {review.rating} ⭐
//                   </td>
//                   <td className="border p-2 text-gray-700">{review.comment}</td>
//                   <td className="border p-2 text-gray-500">
//                     {new Date(review.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerReviews;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SellerReviews = () => {
  const [groupedReviews, setGroupedReviews] = useState({});
  const backendUrl = "http://localhost:4000"; // Update with your backend URL

  // Fetch seller's product reviews
  const fetchSellerReviews = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/seller-reviews`,
        {
          headers: {
            token: localStorage.getItem("token"), // Ensure seller authentication
          },
        }
      );

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

  useEffect(() => {
    fetchSellerReviews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Product Reviews</h2>

      {Object.keys(groupedReviews).length === 0 ? (
        <p className="text-center">No reviews found for your products.</p>
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
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedReviews).map(
              ([productName, { productImage, reviews }], index) =>
                reviews.map((review, reviewIndex) => (
                  <tr key={reviewIndex} className="text-center">
                    {reviewIndex === 0 && (
                      <>
                        <td rowSpan={reviews.length} className=" border p-2">
                          <img
                            src={productImage}
                            alt={productName}
                            className="ml-2 w-20 h-16"
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
                  </tr>
                ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerReviews;
