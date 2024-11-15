const Post = require("../models/Post");  // Make sure to import the Post model (adjust the path as needed)

module.exports = {
  // Index route (existing)
  getIndex: (req, res) => {
    const user = req.user || null;  // Ensure user is defined (from authentication)
    res.render("index.ejs", { user });
  },

  // Explore route
  getExplore: async (req, res) => {
    try {
      const posts = await Post.find();  // Fetch all posts from the Post model
      res.render("explore", {
        title: "Explore",
        posts: posts,  // Pass the posts to the view
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },
};
