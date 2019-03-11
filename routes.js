const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/data", {
  useNewUrlParser: true
});

var mdb = mongoose.connection;

mdb.on("error", console.error.bind(console, "connection error"));
mdb.once("open", function (callback) { });

var userSchema = mongoose.Schema({
  userName: String,
  email: String,
  age: String,
  password: String,
  avaterUrl: String,
  role: String,
});

createUserFromReqBody = body => {
  return new User({
    userName: body.userName,
    email: body.email,
    age: body.age,
    avaterUrl: body.avaterUrl,
    role: body.role || "user",
  });
}

editUserFromReqBody = (user, body) => {
    user.userName = body.userName || user.userName;
    user.email = body.email || user.email;
    user.age = body.age || user.age;
    user.avaterUrl = body.avaterUrl || user.avaterUrl;
    user.role = body.role || user.role;
}

var messageSchema = mongoose.Schema({
  userName: String,
  message: String,
});

createMessageFromReqBody = body => {
  return new Message({
    userName: body.userName,
    message: body.message,
  });
}

var User = mongoose.model("User_Collection", userSchema);
var Message = mongoose.model("Message_Collection", messageSchema);

exports.index = (req, res) => {
  res.render("index", {
    title: "Home Page"
  });
};

exports.edit = (req, res) => {
  User.findById(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);

    res.render("edit", {
      title: "",
      user
    });
  });
};

exports.editUser = (req, res) => {
  User.findById(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);

    editUserFromReqBody(user, req.body);
    user.password = hash;

    user.save((err, user) => {
      if (err) return console.error(err);
      console.log(user.name + " edited");
    });

    res.redirect("/");
  });
};

exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);
    console.log(user.name + " deleted");

    res.redirect("/");
  });
};

exports.details = (req, res) => {
  User.findById(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);
    res.render("details", {
      title: "Person Details",
      user
    });
  });
};

exports.login = (req, res) => {
  res.render('login', {
    title: "Login Page"
  });
}

exports.loginUser = (req, res) => {
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    var curUser = users.find(u => u.userName === req.body.userName);

    if (curUser) {
      bcrypt.compare(req.body.password, curUser.password, (bcErr, isMatch) => {
        if (bcErr) return console.error(bcErr);

        if (isMatch) {//if password matches database hash
          req.session.user = {
            isAuthenticated: true,
            username: req.body.username,
            isAdmin: (curUser.role === "admin")
          };
          res.redirect('/');
        } else {
          res.render('login', {
            title: "Login Page",
            failedMessage: "Password and username do not match.",
            userName: req.body.userName,
          });
        }
      });
    } else {
      res.render('login', {
        title: "Login Page",
        failedMessage: "User does not exist",
        userName: req.body.userName,
      });
    }

  });
}

exports.signup = (req, res) => {
  res.render('signup', {
    title: "Signup Page"
  });
}

exports.signupUser = (req, res) => {
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    var user = createUserFromReqBody(req.body);

    if (users.some(u => u.userName == req.body.userName)) {
      res.render('signup', {
        title: "Signup Page",
        failedMessage: "Username already in use",
        user
      });
    } else {
      bcrypt.hash(req.body.password, null, null, (bcErr, hash) => {
        if (bcErr) return console.error(bcErr);

        user.password = hash;

        user.save((err, user) => {
          if (err) return console.error(err);
          console.log(user.name + " signed up");
        });

        res.redirect("/");
      });
    }
  });
}

exports.admin = (req, res) => {
  res.render('admin', {
    title: "Admin"
  });
}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
}

