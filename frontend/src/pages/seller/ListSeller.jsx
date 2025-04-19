import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


export const currency = "$";
const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);

  const backendUrl = "http://localhost:4000";
  // Fetch all products added by this seller
  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/seller-products",
        {
          headers: {
            token: localStorage.getItem("token"), // Ensure authentication
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setProducts(response.data.products);
        setProductCount(response.data.productCount);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
      try {
        const response = await axios.post(
          backendUrl + "/api/product/remove",
          { id },
          { headers: { token } }
        );
  
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchSellerProducts();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

  useEffect(() => {
    fetchSellerProducts();
  }, []);


  return (
    <>
      <p className="mb-2 ">All Products List</p>

      <div className="flex flex-col gap-2 ">
        {/* ---------------List Table Title ----------------- */}
        <div className="  items-center py-1 px-2 border bg-gray-100 text-sm md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr]">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/*----------------  Product List ----------  */}

        {products.map((item, index) => (
          <div
            className="items-center gap-2 border text-sm  grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr]  "
            key={index}
          >
            <img className="w-12 " src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency} {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
