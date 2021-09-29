// const express = require("express");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const Active = require("../Models/Active_user");
const updateActiv_expiry = require("../updateActiveUser");
exports.signup = async (req, res) => {
  const { username, email, password, phone, role = "user" } = req.body;
  if (!username || !email || !password || !phone) {
    return res.status(422).json({ err: "plz filled properly" });
  }

  ///////////////////////////////// async await or  /////////
  try {
    console.log(username, email, password, phone, role);
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      console.log(userExist);
      return res.status(422).json({ error: "Email alreday Exist" });
    }
    const user = new User({
      username,
      email,
      password,
      phone,
      role,
    });
    /// pre save password hashing in user schema
    const userRegister = await user.save();
    if (userRegister) {
      res.status(201).json({ message: "User resgister successfuly" });
    } else {
      res.status(500).json({ error: "Faild to register" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Incoreet Email addresh", err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(422).json({ err: "plz fill data properly" });
  }
  console.log(email, password);
  User.findOne({ email: email }).exec(async (err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (user) {
      console.log(user);
      if (user.authenticate(password)) {
        const token = jwt.sign(
          { _id: user._id, user },
          process.env.SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );
        const { _id, email, name } = user;
        updateActiv_expiry.update_Expiry_day(
          res,
          token,
          _id,
          email,
          name,
          user
        );

        ///////////////////// user active update  ///////////////////////////////

        // const active = new Active({
        //   _id,
        //   name,
        // });
        // const userRegister = await active.save();
        // if (userRegister) {
        //   res.status(200).json({ token, _id, email, name, user });
        // } else {
        //   return res.status.json({
        //     message: "incoreet usr or email",
        //   });
        // }
      } else {
        return res.status.json({
          message: "incoreet usr or email",
        });
      }
    } else {
      return res.status(400).send({ message: "email or password wrong" });
    }
  });
};
