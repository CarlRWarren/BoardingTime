const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/data", {
  useNewUrlParser: true
});

var mdb = mongoose.connection;

mdb.on("error", console.error.bind(console, "connection error"));
mdb.once("open", function(callback) {});

var userSchema = mongoose.Schema({
  userName: String,
  avaterUrl: String,
  password: String,
  role: String,
  email: String,
  age: String
});

var messageSchema = mongoose.Schema({
  userName: String,
  message: String
});

var User = mongoose.model("User_Collection", userSchema);
var Message = mongoose.model("Message_Collection", messageSchema);

exports.index = (req, res) => {
    res.render("index", {
      title: "Home Page"
    });
};

exports.create = (req, res) => {
  res.render("create", {
    title: ""
  });
};

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, null, null, (err, hash) => {
    if (err) return console.error(err);

    var user = new User({
      userName: req.body.userName,
      avaterUrl: req.body.avaterUrl,
      password: hash,
      role: req.body.role,
      email: req.body.email,
      age: req.body.age
    });

    user.save((err, user) => {
      if (err) return console.error(err);
      console.log(user.userName + " added");
    });
  });
  res.redirect("/");
};

exports.edit = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return console.error(err);

    res.render("edit", {
      title: "",
      user
    });
  });
};

exports.editUser = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return console.error(err);
    user.userName = req.body.userName;
    user.avaterUrl = req.body.avaterUrl;
    user.password = hash;
    user.role = req.body.role;
    user.email = req.body.email;
    user.age = req.body.age;

    user.save((err, user) => {
      if (err) return console.error(err);
      console.log(user.name + " edited");
    });

    res.redirect("/");
  });
};

exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) return console.error(err);
    console.log(user.name + " deleted");

    res.redirect("/");
  });
};

exports.details = (req, res) => {
  User.findById(req.params.id, (err, user)=> {
    if (err) return console.error(err);
    res.render("details", {
      title: "Person Details",
      user
    });
  });
};

// exports.index = (req, res) => {
//   res.render("index", {
//     title: "Home Page"
//   });
// };

exports.login = (req, res) => {
    res.render('login', {
        title: "Login Page"
    });
}

exports.signup = (req, res) => {
    res.render('signup', {
        title: "Signup Page"
    });
}