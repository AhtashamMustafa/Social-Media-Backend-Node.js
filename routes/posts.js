import { Router } from "express";
import Post from "../models/post.js";
import User from "../models/user.js";

const router = Router();

//Create a Post

router.post("/", async (req, res) => {
  try {

    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json("Your post has been created successfully");

  } catch (err) {

    console.error(err);
    res.status(500).send("Error in creating post==>", err.message);

  }
});
//Update a Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {

      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("Your post has been updated successfully");

    } else {

      return res.status(403).json("You can only update your own post");
    }
  } catch (err) {

    res.status(500).json("Error in updating the post==> ", err.message);
  }
});

//Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {

      const updatedPost = await Post.findByIdAndDelete(req.params.id, {
        $set: req.body,
      });

      return res.status(200).json("Your post has been deleted successfully");

    } else {

      return res.status(403).json("You can only delete your own post");

    }
  } catch (err) {

    res.status(500).json("Error in deleting the post==> ", err.message);
  }
});

//Like / dislike a Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {

      const likePost = await Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.body.userId },
      });

      return res.status(200).json("Post has been Liked");

    } else {

      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.body.userId },

      });

      return res.status(200).json("Post has been disliked");
    }
  } catch (err) {

    res.status(500).json("Error in liking the post==> ", err.message);
  }
});
//Get a Post
router.get("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json("Error in getting post")
    }
})


//Get timeline Posts

router.get("/timeline/all",async (req, res) => {

  try {
    const currentUser = await User.findById(req.body.userId);
    console.log(currentUser)
    const userPosts = await Post.find({userId:currentUser._id})
    console.log(userPosts)
    const friendPost = await Promise.all(
        currentUser.following.map((friendId)=> Post.find({userId:friendId}))
    )
    console.log(friendPost)
    res.status(200).json(userPosts.concat(...friendPost))
  } catch (err) {
    res.status(500).json("Error in getting timeline posts")
  }
});

export default router;
