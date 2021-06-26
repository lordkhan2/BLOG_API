const router = require("express").Router();
const verify = require("../middleware/verify");
const { deleteUser, updateUser, getUser } = require("../controller/user");

//UPDATE
router.put("/:userId", verify, updateUser);

//DELETE
router.delete("/:userId", verify, deleteUser);

//GET USER
router.get("/:userId", getUser);

module.exports = router;
