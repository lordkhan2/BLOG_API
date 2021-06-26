const router = require("express").Router();
const verify = require("../middleware/verify");
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  commentPost,
} = require("../controller/posts");

//CREATE POST
router.post("/:userId", verify, createPost);

//UPDATE POST
router.put("/:userId", verify, updatePost);

//DELETE POST
router.delete("/:userId", verify, deletePost);

//GET POST
router.get("/:postId", getPost);

//GET ALL POSTS
router.get("/", getAllPosts);

//Comment
router.put("/:userId", verify, commentPost);

module.exports = router;
