const Todo = require("../Models/Todo");
exports.addtodo = async (req, res) => {
  const { userId, username, title, category, status = false } = req.body;
  /// category = shudld be this value "task", "hobby", "work"],
  //console.log(title, category);
  const todo = new Todo({
    username,
    title,
    category,
    userId,
    status,
  });

  todo.save((error, todo) => {
    if (error) {
      return res.status(400).json({
        message: "bad reqest data not added",
      });
    }

    if (todo) {
      return res.status(201).json({
        message: "Successfully addded a Todo",
        todo,
      });
    }
  });
};

exports.getalltodoByUser = async (req, res) => {
  try {
    let userId = req.user._id; // its get from middlware
    //console.log("usertodfile", userId);
    //////////////////////// Get all Todo //////////////////////////////
    ///////////////// sorting Todo by createdAt //////////////////////////////
    const { page = 1, limit = 5 } = req.query;
    const todo = await Todo.find({ userId: userId })
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

/////////////// Get All Todo and also filetr by create at //////////////

exports.getallTodoByCategory = async (req, res) => {
  try {
    // console.log(req.params.id);
    let userId = req.user._id; // its get from middlware
    let key = [];
    for (let k in req.query) {
      key.push(k);
    }

    let firstKey = key[0];

    if (key.length == 1) {
      // console.log(req.query[firstKey]);
      firstKey == "true" ? (firstKey = true) : "";
      req.query[key][0] == "false" ? (req.query[key][0] = false) : "";

      ///////////////// if it has query then fillter by given key//////////////////////////////
      ///////////////// // route ex http://localhost:3000/todo/?status=true   ////////////////////
      ///////////////// // req.query = example {key : value}   ////////////////////

      const response = await Todo.find({
        userId: userId,
        key: req.query[key][0],
      }).sort({
        createdAt: -1,
      });

      ///////////////// chcke filterd data found or Not//////////////////////////////
      if (response.length <= 0) {
        res.status(404).json({
          success: false,
          message: `Not Found ${key} of Todo`,
          todo: response,
        });
      }
      ///////////////// Filterd data resposed//////////////////////////////
      res.status(200).json({
        success: true,
        message: `All ${key} of Todo`,
        todo: response,
      });
    } else {
      ///////////////// respose all todo whithout filtering route (/)//////////////////////////////
      res.status(400).json({ success: false, message: "Add only One key" });
    }
  } catch (err) {
    // console.log(err);
    res.status(404).json({ success: false, message: "data not found", err });
  }
};

/////////////// Get by Todo Id //////////////

exports.gettodoById = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try {
    const todo = await Todo.findById({ _id: id });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: `Todo Not found this id:${id}`,
      });
    }

    res.status(200).json({ success: true, todo });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ success: false, message: "data not found", err });
  }
};
/////////////// Get by Todo Id //////////////

exports.updatetodo = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    const todo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidator: true,
      useFindAndModify: false,
    });

    if (!todo) {
      res.status(402).json({
        success: false,
        message: `Todo  unsuccessful update this id:${id}`,
      });
    }

    res.status(200).json({ success: true, message: todo });
  } catch (err) {
    // console.log(err);
    res.status(402).json({
      success: false,
      message: `Todo  unsuccessful update this id:${id}`,
      err,
    });
  }
};

exports.deletetodo = async (req, res) => {
  try {
    let id = req.params.id;
    const todo = await Todo.findOneAndDelete({ _id: id });
    console.log(todo);
    if (todo) {
      res.status(201).json({ success: true, message: "Todo removed" });
    } else {
      res.status(204).json({ success: false, message: "not deleted todo" });
    }
  } catch (err) {
    res.status(204).json({ success: false, message: "not deleted todo", err });
  }
};

/////////////// All Admin Operatin Below //////////////
