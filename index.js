const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const todoRoute = require("./router/todorouter");
const userRoute = require("./router/userRouter");
const adminRoute = require("./router/adminRoute");
const app = express();

app.use(express.json());

// app.get("/", function (req, res) {
//   res.send(" <h1> home Page </h1>");
//   // res.render("home");
// });

// app.use("/todo", todoRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

// console.log(process.env.MONGO_DB_URI);
// DB conection
mongoose.connect(process.env.MONGO_DB_URI, {});
mongoose.connection
  .once("open", function () {
    console.log("Connected to Mongo");
  })
  .on("error", function (err) {
    console.log("Mongo Error", err);
  });

app.listen(3000, () => {
  console.log("Server is up and running at the port 3000");
});
