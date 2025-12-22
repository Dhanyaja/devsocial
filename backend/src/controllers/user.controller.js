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

export const sendFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({ message: "Already friends" });
    }
    if (currentUser.sentRequests.includes(targetUserId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    if (currentUser.friendRequests.includes(targetUserId)) {
      return res
        .status(400)
        .json({ message: "You already have a request from this user" });
    }

    currentUser.sentRequests.push(targetUserId);
    targetUser.friendRequests.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.id;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if request exists
    if (!currentUser.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No friend request found" });
    }

    // remove request
    currentUser.friendRequests.pull(requesterId);
    requester.sentRequests.pull(currentUserId);

    // add to friends
    currentUser.friends.push(requesterId);
    requester.friends.push(currentUserId);

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.id;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No friend request found" });
    }

    // remove request
    currentUser.friendRequests.pull(requesterId);
    requester.sentRequests.pull(currentUserId);

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    // prevent self-remove
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot remove yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if friends with that user
    if (!currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({ message: "You are not friends" });
    }

    currentUser.friends.pull(targetUserId);
    targetUser.friends.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


