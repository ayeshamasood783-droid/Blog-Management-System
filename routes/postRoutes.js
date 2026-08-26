const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  getPosts, getPost, createPost, updatePost, deletePost
} = require("../controllers/postController");

const postValidation = [
  body("title").trim().isLength({ min: 3, max: 160 }).withMessage("Title must be 3-160 characters."),
  body("content").trim().isLength({ min: 10, max: 20000 }).withMessage("Content must be 10-20,000 characters.")
];

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, postValidation, createPost);
router.put("/:id", auth, postValidation, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
