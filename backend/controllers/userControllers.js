// const { hashPassword, comparePassword } = require("../helpers/authHelper");
// const { userModel } = require("../models/userModel");
// const generateToken = require("../helpers/generateToken");


// const registerUser = async (req, res) => {
//     // Extract user information from the request body
//     const { username, email, password } = req.body;

//     // Basic validation
//     if (!username || !email || !password) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     try {
//         // Check if the user already exists
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "User already exists" });
//         }

//         //Create a new user
//         let newUser = {
//             username,
//             email,
//             password: hashPassword(password)
//         }

//         newUser = await userModel.create(newUser)

//         // Respond with a success message
//         if (newUser) {
//             return res.status(201).json({
//                 message: "User registered successfully",
//                 user: {
//                     _id: newUser._id,
//                     username: newUser.username,
//                     email: newUser.email,
//                     pic: newUser.pic,
//                     token: generateToken(newUser._id)
//                 }
//             })
//         }

//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }

// }

// const loginUser = async (req, res) => {

//     // Extract user information from the request body
//     const { email, password } = req.body;
//     console.log(email, password)

//     // Basic validation
//     if (!email || !password) {
//         return res.status(400).json({ error: "All fields are required" })
//     }

//     try {
//         //Check if User Exist
//         let user = await userModel.findOne({ email });

//         //If user doesn't exist send error message
//         if (!user) {
//             return res.status(400).json({ error: "Wrong Email or Password" })
//         }

//         //password check
//         let passwordCheck = comparePassword(password, user.password);

//         if (!passwordCheck) {
//             return res.status(400).json({ error: "Wrong Email or Password" })
//         }

//         //send -> response (Login successfull)
//         return res.status(201).json({
//             message: "Login Success",
//             user: {
//                 _id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 pic: user.pic,
//                 token: generateToken(user._id)
//             }
//         })

//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }

// }


// module.exports = { registerUser, loginUser }