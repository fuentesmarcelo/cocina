const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // Ensure multer is properly configured in this file
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Post Routes
router.get("/:id", ensureAuth, postsController.getPost);

// Route to render the edit form for a post
router.get("/edit/:id", ensureAuth, postsController.getEditPost); // Updated to use getEditPost function

// Use upload.single("file") to handle single image uploads for both creating and editing a post
router.post("/createPost", ensureAuth, upload.single("file"), postsController.createPost);
router.put("/edit/:id", ensureAuth, upload.single("file"), postsController.editPost); // Changed to `put` for editing

// Like Post Route
router.put("/likePost/:id", ensureAuth, postsController.likePost);

// Delete Post Route
router.delete("/:id", ensureAuth, postsController.deletePost);

module.exports = router;
