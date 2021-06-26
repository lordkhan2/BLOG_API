const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE
const updateUser = async (req, res) => {
  console.log(req.user.id);
  if (req.user.id === req.params.userId) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
};

//DELETE
const deleteUser = async (req, res) => {
  console.log("reached user");
  console.log(req.user.id);
  console.log(req.params.userId);
  if (req.user.id === req.params.userId) {
    try {
      const user = await User.findById(req.params.userId);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
};

//GET USER
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { updateUser, deleteUser, getUser };
