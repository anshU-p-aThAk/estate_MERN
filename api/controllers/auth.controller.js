import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Debugging: Log the values to ensure they are defined
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Check if any required field is missing
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" }); // 400 -> Bad Request
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully"); // 201 -> something is created
    } catch (error) {
        next(error); // 500 -> error happened inside server
    }
};



export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

        const token = jwt.sign({ id: validUser._d }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;

        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}
