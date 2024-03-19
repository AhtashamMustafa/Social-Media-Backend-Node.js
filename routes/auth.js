import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();
//API

//Register
router.post("/register", async (req, res) => {
  let salt;
  let hashedPassword;
  let newUser;

  try {
    // Generate new password
    if (req.body.password) {
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    } else {
      return res.status(401).json("Password is required");
    }

    // Create new user
    if (req.body.username && req.body.email && req.body.password) {
        newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        desc: req.body.desc,
      });
    } else {
      return res.status(400).json("All fields are required");
    }

    // Save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log("Error in Register api ==>", err);
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("User not found");
      }
    } else {
      return res.status(400).json("Email is required");
    }
    if(req.body.password){
      const user = await User.findOne({ email: req.body.email });
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json("Password is invalid");
      }
      res.status(200).json(user);
    } else {
      return res.status(400).json("Password is required");
    }
  } catch (err) {
    console.log("Error in login api ==>", err);
    res.status(500).json(err);
  }
});

export default router;
