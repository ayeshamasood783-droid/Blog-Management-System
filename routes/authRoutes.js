const router = require("express").Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const emailRule = body("email").isEmail().normalizeEmail().withMessage("Enter a valid email.");
const passwordRule = body("password")
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be 8-72 characters.");

router.post("/register", [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters."),
  emailRule,
  passwordRule
], register);

router.post("/login", [emailRule, passwordRule], login);

module.exports = router;
