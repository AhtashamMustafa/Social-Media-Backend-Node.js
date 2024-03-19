import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json("Error in generating password==>", err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      console.log(req.params.id);
      console.log(req.body);
      res.status(200).json("Account has been Updated");
    } catch (err) {
      return res.status(500).json("Error in updating Account==>", err);
    }
  } else {
    return res
      .status(403)
      .json("You are not authorized to perform this action");
  }
});

//Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been Deleted Successfully");
    } catch (err) {
      return res.status(500).json("Error in Deleting Account==>", err);
    }
  } else {
    return res
      .status(403)
      .json("You are not authorized to perform this action");
  }
});

//Get A User

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const { password, updatedAt, ...other } = user.toObject();

    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json("Error in getting Account==>", err.message);
  }
});
//Follow a User

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      const currentUser = await User.findById(req.body.userId);
      if (!currentUser) {
        return res.status(404).json("Current user not found");
      }

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });

        await currentUser.updateOne({ $push: { following: req.params.id } });

        res.status(200).json("Account has been followed successfully");
      } else {
        return res.status(409).json("You already follow this account");
      }
      //   res.status(200).json("Account has been followed successfully");
    } catch (err) {
      return res.status(500).json("Error in following account==>", err.message);
    }
  } else {
    return res.status(403).json("You cannot follow yourself");
  }
});

//Unfollow a User
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      const currentUser = await User.findById(req.body.userId);
      if (!currentUser) {
        return res.status(404).json("Current user not found");
      }

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        return res.status(200).json("Account has been unfollowed successfully");
      } else {
        return res.status(409).json("You don't follow this account");
      }
    } catch (err) {
      return res
        .status(500)
        .json("Error in unfollow account ==> " + err.message);
    }
  } else {
    return res.status(403).json("You cannot unfollow yourself");
  }
});

export default router;
