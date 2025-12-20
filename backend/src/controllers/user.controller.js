import User from "../models/User.js";

/**
 * @desc Get logged-in user's profile
 * @route GET /api/users/me
 * @access Private
 */

export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 
 * @desc Get any user's public profile by ID
 * @route GET /api/users/:id
 * @access Private
 */

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid user ID" });
  }
};
