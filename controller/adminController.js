const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const Todo = require("../Models/Todo");
const dateFormat = require("../datefarmat");
const ActiveUser = require("../Models/Active_user");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ err: "plz fill data properly" });
  }
  console.log(email, password);
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (user) {
      ///////////////////////////// check user admin   /////////////////////////////////////////
      if (user.role == "admin") {
        if (user.authenticate(password)) {
          const token = jwt.sign(
            { _id: user._id, date: new date() }, /// all data add karne ko bele sir
            process.env.SECRET_KEY_ADMIN,
            {
              expiresIn: "24h",
            }
          );
          const { _id, email, name } = user;
          res.status(200).json({ token, _id, email, name, user });
        } else {
          return res.status.json({
            message: "incoreet usr or email",
          });
        }
      } else {
        return res
          .status(400)
          .send({ message: "You are Not admin login denied this route" });
      }
    } else {
      return res.status(400).send({ message: "email or password wrong" });
    }
  });
};

exports.getalltodoByAdmin = async (req, res) => {
  try {
    let userId = req.user._id; // its get from middlware
    //console.log( userId);
    const { page = 1, limit = 5 } = req.query;
    const todo = await Todo.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    console.log(todo);
    if (!todo) {
      res.status(404).json({
        success: false,
        message: `Not Found any Todo Data`,
      });
    }

    res.status(200).json({ success: true, message: "All Todo", todo });
  } catch (err) {
    console.log(err);
  }
};

exports.get_Active_Users = async (req, res) => {
  try {
    const todayActive = await ActiveUser.find();

    if (!todayActive) {
      res.status(404).json({
        success: false,
        message: `Not Found any Users for current day`,
      });
    }

    res.status(200).json({
      success: true,
      message: " All Active User for current day ",
      todayActive,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_registered_Users_for_the_Day = async (req, res) => {
  try {
    //db.User.find({"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
    //console.log(dateFormat.currentDate);
    //console.log(dateFormat.nextDate);
    const user = await User.findOne({
      createdAt: { $gte: dateFormat.currentDate, $lt: dateFormat.nextDate },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: `Not Found any registered Users for the_Day`,
      });
    }

    res.status(200).json({
      success: true,
      message: " All registered Users for the_Day",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

// new Date().getDate(createdAt)
