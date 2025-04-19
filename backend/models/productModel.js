import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 }, 
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      username: { type: String, required: true }, // To display the reviewer's name
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});


const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel;