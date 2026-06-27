import express from "express"
import dotenv from "dotenv"
import corsConfig from "./configs/corsConfig.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(corsConfig());
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("API running")
});

app.use("/api/v1/user", userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
