import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";
// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
dotenv.config();

// middlewares 

app.use(
  cors({
    // origin: "https://shop-spot-fend.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());


// api endpoints
app.use('/api/user',userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter);

app.use('/api/admin' , productRouter );

app.get('/' , (req,res) => {
    res.send('API working');
});





app.listen(port , () => {
    console.log("Server started on port : " + port);
})
