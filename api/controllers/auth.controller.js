import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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
