const express = require("express");
const userCollection = require("../models/signup");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Router = express.Router();

const secret = process.env.secret;

function userCreation(DataCount) {
  let count = String(DataCount);
  let userid = "";
  if (count.length == 1) {
    userid = "USER" + "111" + count;
    return userid;
  } else if (count.length == 2) {
    userid = "USER" + "11" + count;
    return userid;
  } else if (count.length == 3) {
    userid = "USER" + "1" + count;
    return userid;
  } else {
    userid = "USER" + count;
    return userid;
  }
}

Router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({
    min: 6,
    max: 16,
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let { email, password } = req.body;
      let user = await userCollection.findOne({ email: email });
      console.log(user);
      if (user) {
        return res.status(409).json({
          status: "Failed",
          message: "email already exists",
          email: user.email,
        });
      }

      //hashing password
      //userid Creation
      let DataCount = await userCollection.count();
      let userid = userCreation(DataCount);
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            status: "Failed at hashing pass",
            message: err.message,
          });
        }

        //storing hashed password and email to DB
        user = await userCollection.create({
          email: req.body.email,
          password: hash,
          userid: userid,
        });

        //post message
        res.json({
          status: "success",
          message: "user successfully created",
          userid: userid,
          email: req.body.email,
        });
      });
    } catch (e) {
      //else some exception error occurs
      res.json({
        status: "Failed exception",
        message: e.message,
      });
    }
  }
);

Router.post("/login", async (req, res) => {
  // 1. Check whether user already exists or not
  const { email, password } = req.body;
  console.log("email " + req.body.email);

  if (req.body.email === "" || req.body.password === "") {
    return res.status(409).json({
      status: "failed",
      message: "fields can not be empty",
    });
  }
  let user = await userCollection.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return res.status(409).json({
      status: "failed",
      message: "user does not exist",
      user,
    });
  }

  // Load hash from your password DB.
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
    // if pass matched, Login successful
    // else credential does not matched
    if (result) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: user._id,
        },
        secret
      );
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        userid: user.userid,
        email: req.body.email,
        token,
      });
    } else {
      return res.status(409).json({
        status: "failed",
        message: "credential does not matched",
      });
    }
  });
});

module.exports = Router;
