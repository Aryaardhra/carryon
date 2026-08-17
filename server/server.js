import express from "express"
import dotenv from "dotenv"
import corsConfig from "./configs/corsConfig.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js"
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import testStripeConnection from "./configs/stripe.js";
import orderRouter from "./routes/orderRoute.js";
import stripeRouter from "./routes/stripeRoute.js";
import addressRouter from "./routes/addressRoutes.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(corsConfig());

app.use("/v1/stripe", stripeRouter);

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("API running")
});

app.use("/v1/user", userRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/product", productRouter);
app.use("/v1/cart/", cartRouter);
app.use("/v1/orders", orderRouter);
app.use("/v1/addresses", addressRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
