import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(express.json());
app.use(cors()); // Use CORS middleware

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//Error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
})