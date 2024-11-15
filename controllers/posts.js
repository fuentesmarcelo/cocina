const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User"); 


module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate("user", "userName");
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createPost: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });

      const newPost = new Post({
        title: req.body.title,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        imagePath: result.secure_url,
        cloudinaryId: result.public_id,
        user: req.user.id,
      });

      await newPost.save();
      console.log("Recipe post created successfully!");
      res.redirect("/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 } }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  getEditPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      res.render("editPost.ejs", { post: post });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading the edit page");
    }
  },

  editPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (req.file) {
        await cloudinary.uploader.destroy(post.cloudinaryId);

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "posts",
        });

        post.imagePath = result.secure_url;
        post.cloudinaryId = result.public_id;
      }

      post.title = req.body.title || post.title;
      post.ingredients = req.body.ingredients || post.ingredients;
      post.directions = req.body.directions || post.directions;

      await post.save();
      console.log("Post updated successfully!");
      res.redirect(`/post/${post._id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating the post");
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });

      if (!post) {
        return res.status(404).send("Post not found");
      }

      await cloudinary.uploader.destroy(post.cloudinaryId);

      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");

      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error while deleting the post");
    }
  },
};
