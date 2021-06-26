const Post = require("../models/Post");

//CREATE POST
const createPost = async (req, res) => {
  if (req.user.id === req.params.userId) {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("log in to post");
  }
};

//UPDATE POST
const updatePost = async (req, res) => {
  if (req.user.id === req.params.userId) {
    try {
      const post = await Post.findById(req.body.postId);
      console.log(post);
      if (post.username === req.body.username) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.body.postId,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can update only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update on your account");
  }
};

//DElETE POST
const deletePost = async (req, res) => {
  if (req.user.id === req.params.userId) {
    try {
      const post = await Post.findById(req.body.postId);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted...");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can delete only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only delete on your account");
  }
};

//GET POST
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL POSTS
const getAllPosts = async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Comment
const commentPost = async (req, res) => {
  if (req.user.id === req.params.userId) {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    try {
      await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name");
      res.status(200).json("comment posted");
    } catch (err) {
      res.status(422).json(err);
    }
  } else {
    res.status(401).json("Not your account");
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  commentPost,
};
