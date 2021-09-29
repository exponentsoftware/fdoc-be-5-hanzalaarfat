const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/userController");
const todocontroller = require("../controller/todocontroller");
const userAutcontroller = require("../Middleware/authenticate");

router.post("/signup", usercontroller.signup);
router.post("/login", usercontroller.login);

router.get(
  "/todo",
  userAutcontroller.requireSignin,
  todocontroller.getalltodoByUser
);
router.get(
  "/todo/category",
  userAutcontroller.requireSignin,
  todocontroller.getallTodoByCategory
); // user ki  id se hi get hoga   // isi route pe all todo aur filter query bhi hoga
router.post(
  "/todo/add",
  userAutcontroller.requireSignin,
  todocontroller.addtodo
);
router.get("/todo/:id", todocontroller.gettodoById);
router.put(
  "/todo/:id",
  userAutcontroller.requireSignin,
  todocontroller.updatetodo
);
router.delete("/todo/:id", todocontroller.deletetodo);

module.exports = router;
