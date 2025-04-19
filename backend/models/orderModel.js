import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed " },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  // date: { type: Number, default: () => Date.now() },

  // date: { type: Number, default: Date.now() },

  // Store date in "YYYY-MM-DD" format
  date: {
    type: String,
    default: () => {
      const today = new Date();
      return today.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
    },
  },

  // expectedDeliveryDate: {
  //   type: Date,
  //   default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days after order
  // },
  expectedDeliveryDate: {
    type: String,
    default: () => {
      const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days later
      return date.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
    },
  },
  
});

const orederModel = mongoose.model.order || mongoose.model('order', orderSchema);

export default orederModel;
