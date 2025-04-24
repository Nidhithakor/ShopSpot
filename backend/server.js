import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
// dotenv.config();

// middlewares 
app.use(express.json());
// app.use(cors());

// api endpoints
app.use('/api/user',userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter);

app.use('/api/admin' , productRouter );

app.get('/' , (req,res) => {
    res.send('API working');
});


const allowedOrigins = [
  "https://shop-spot-nu.vercel.app", // production
  /\.vercel\.app$/, // regex to allow ALL vercel preview URLs
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.some((o) =>
          typeof o === "string" ? origin === o : o.test(origin)
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



app.listen(port , () => {
    console.log("Server started on port : " + port);
})
