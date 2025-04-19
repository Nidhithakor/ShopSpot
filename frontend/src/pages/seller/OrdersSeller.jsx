  
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/frontend_assets/assets.js";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);


  // fetch all orders by the user for the product added by specific seller
  const fetchSellerOrders = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/order/seller-orders`,
        {
          headers: { token: localStorage.getItem("token") }, // Ensure authentication
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  // update order status as pending out for deliery 
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Order status updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating order status"
      );
    }
  };

  const updateDeliveryDate = async (orderId, newDate) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/update-delivery-date`,
        { orderId, expectedDeliveryDate: newDate },
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, expectedDeliveryDate: newDate }
              : order
          )
        );
        toast.success("Expected delivery date updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating delivery date"
      );
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>

      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel" />
            <div>
              {order.items.map((item, index) => (
                <p key={index} className="py-0.5">
                  {item.name} X {item.quantity} <span>{item.size}</span>
                  {index < order.items.length - 1 && ","}
                </p>
              ))}
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street},</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}, {order.address.zipcode}
              </p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency} {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold border-gray-700"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            {/* Expected Delivery Date */}
            <div className="flex flex-col gap-2">
              <label>Expected Delivery Date:</label>
              <input
                type="date"
                value={
                  order.expectedDeliveryDate
                    ? new Date(order.expectedDeliveryDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) => updateDeliveryDate(order._id, e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
