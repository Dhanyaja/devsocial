import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content is required" });
    }
    const post = await Post.create({
        author: req.user._id,
        content,
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

