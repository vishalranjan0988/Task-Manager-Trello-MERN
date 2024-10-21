const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

// REST api for User Sign Up

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exist with given email" });
    }
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new USER({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          res.json({ message: "Successfully Signed Up" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

// User Sign In

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Email and Password is needed" });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    bcrypt.compare(password, savedUser.password).then((match) => {
      if (match) {
        //assign jwt token
        const token = jwt.sign({ _id: savedUser.id }, process.env.Jwt_secret);
        const { _id, firstName, lastName, email, avtar } = savedUser;
        res
          .status(200)
          .json({
            message: "Signed In Successfully",
            token: token,
            user: { _id, firstName, lastName, email, avtar },
          });
      } else {
        return res.status(422).json({ error: "Invalid Password" });
      }
    });
  });
});

//Google Auth

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // Create JWT token
    const userToken = jwt.sign(
      { name, email, picture },
      process.env.Jwt_secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: userToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

module.exports = router;
