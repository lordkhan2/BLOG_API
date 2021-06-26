const router = require("express").Router();
const { getCategory, postCategory } = require("../controller/categories");

//POST CATEGORY
router.post("/", postCategory);

//GEt CATEGORY
router.get("/", getCategory);

module.exports = router;
