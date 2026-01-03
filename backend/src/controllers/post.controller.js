import Post from "../models/Post.js";
import User from "../models/User.js";

// create post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content is required" });
    }
    const post = await Post.create({
      author: req.user._id,
      content,
    });
    return res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feed
// export const getFeed = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     const posts = await Post.find({
//       author: { $in: [user._id, ...user.friends] },
//     })
//       .populate("author", "name email")
//       .populate("comments.user", "name")
//       .sort({ createdAt: -1 });

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getFeed = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.min(parseInt(req.query.limit) || 10, 50);
//     const skip = (page - 1) * limit;

//     const user = await User.findById(userId).select("friends");

//     const feedQuery = {
//       author: { $in: [...user.friends, userId] },
//     };

//     const posts = await Post.find(feedQuery)
//       .populate("author", "name email")
//       .populate("comments.user", "name")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalPosts = await Post.countDocuments(feedQuery);

//     res.status(200).json({
//       page,
//       limit,
//       totalPosts,
//       totalPages: Math.ceil(totalPosts / limit),
//       hasMore: page * limit < totalPosts,
//       posts,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get feed
export const getFeed = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // 🔥 GLOBAL FEED — NO FILTER
    const posts = await Post.find({})
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      page,
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by user
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like or unlike post
// export const toggleLike = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const userId = req.user._id;

//     if (post.likes.includes(userId)) {
//       post.likes.pull(userId);
//     } else {
//       post.likes.push(userId);
//     }
//     await post.save();
//     res.status(200).json({
//       message: "Like updated",
//       likesCount: post.likes.length,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // 🔥 Return FULL updated post
    const updatedPost = await Post.findById(post._id)
      .populate("author", "name")
      .populate("comments.user", "name");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({
      user: req.user._id,
      text,
    });
    await post.save();
    const updatedPost = await Post.findById(post._id).populate(
      "comments.user",
      "name"
    );
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();

    // ownership check
    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }
    comment.deleteOne();
    await post.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getPostsByUser = async (req, res) => {
//   const posts = await Post.find({ author: req.params.userId })
//     .populate("author", "name email")
//     .sort({ createdAt: -1 });

//   res.json(posts);
// };
