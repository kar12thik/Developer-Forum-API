import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";

// @desc Create a new user
// @route POST /api/users
// @access Public
const createUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

export { createUser };
