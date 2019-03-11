const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs"),
  config = require("./config.json");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/data", {
  useNewUrlParser: true
});

var mdb = mongoose.connection;

mdb.on("error", console.error.bind(console, "connection error"));
mdb.once("open", function (callback) { });

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  age: String,
  password: String,
  avatarurl: String,
  role: String,
});

createUserFromReqBody = body => {
  return new User({
    username: body.username,
    email: body.email,
    age: body.age,
    avatarurl: body.avatarurl,
    role: body.role || "user",
  });
}

editUserFromReqBody = (user, body) => {
  user.username = body.username || user.username;
  user.email = body.email || user.email;
  user.age = body.age || user.age;
  user.avatarurl = body.avatarurl || user.avatarurl;
  user.role = body.role || user.role;
}

var messageSchema = mongoose.Schema({
  username: String,
  message: String,
});

var User = mongoose.model("User_Collection", userSchema);
var Message = mongoose.model("Message_Collection", messageSchema);

getStateFromSession = (session) => {
  if (!session.user) {
    return "logged out";
  } else if (session.user.isAdmin) {
    return "admin";
  } else {
    return "user";
  }
}

exports.index = (req, res) => {
  Message.find((dbErr, messages) => {
    if (dbErr) return console.error(dbErr);

    res.render("index", {
      title: "Home Page",
      config,
      state: getStateFromSession(req.session),
      messages,
      loggedin: (req.session.user != null && req.session.user != undefined)
    });
  });
};

exports.postMessage = (req, res) => {
  var message = new Message({
    username: req.session.user.username,
    message: req.body.message
  });

  message.save((err, message) => {
    if (err) return console.error(err);
    console.log(message.username + " posted " + message.message);
  });

  res.redirect('/');
}

exports.edit = (req, res) => {
  var id = req.params.id;
  if (!id) {
    id = req.session.user.id;
  }
  User.findById(id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);

    res.render("signupEdit", {
      title: "",
      config,
      state: getStateFromSession(req.session),
      user,
      edit: true
    });
  });
};

exports.editUser = (req, res) => {
  var id = req.params.id;
  if (!id) {
    id = req.session.user.id;
  }
  
  User.findById(id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);

    editUserFromReqBody(user, req.body);

    if (user.password) {
      bcrypt.hash(req.body.password, null, null, (bcErr, hash) => {
        if (bcErr) return console.error(bcErr);
        user.password = hash;
        user.save((err, user) => {
          if (err) return console.error(err);
          console.log(user.username + " edited");
        });
        res.redirect("/");
      });
    } else {
      user.save((err, user) => {
        if (err) return console.error(err);
        console.log(user.username + " edited");
      });
      res.redirect("/");
    }
  });
};

exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);
    console.log(user.username + " deleted");

    res.redirect("/");
  });
};

exports.details = (req, res) => {
  User.findById(req.params.id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);
    res.render("details", {
      title: "Person Details",
      config,
      state: getStateFromSession(req.session),
      user
    });
  });
};

exports.login = (req, res) => {
  res.render('login', {
    title: "Login Page",
    config,
    state: getStateFromSession(req.session)
  });
}

exports.loginUser = (req, res) => {
  console.log("loginUser");
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    var curUser = users.find(u => u.username === req.body.username);
    console.log("db didn't error");

    if (curUser) {
      bcrypt.compare(req.body.password, curUser.password, (bcErr, isMatch) => {
        if (bcErr) return console.error(bcErr);
        console.log("bc didn't error");


        if (isMatch) {//if password matches database hash
          req.session.user = {
            isAuthenticated: true,
            username: req.body.username,
            id: curUser.id,
            isAdmin: (curUser.role === "admin")
          };
          res.redirect('/');
        } else {
          res.render('login', {
            title: "Login Page",
            config,
            state: getStateFromSession(req.session),
            failedMessage: "Password and username do not match.",
            username: req.body.username,
          });
        }
      });
    } else {
      res.render('login', {
        title: "Login Page",
        config,
        state: getStateFromSession(req.session),
        failedMessage: "User does not exist",
        username: req.body.username,
      });
    }

  });
}

exports.signup = (req, res) => {
  res.render('signupEdit', {
    title: "Signup Page",
    config,
    state: getStateFromSession(req.session)
  });
}

exports.signupUser = (req, res) => {
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    var user = createUserFromReqBody(req.body);

    if (users.some(u => u.username == req.body.username)) {
      res.render('signupEdit', {
        title: "Signup Page",
        config,
        state: getStateFromSession(req.session),
        failedMessage: "username already in use",
        user
      });
    } else {
      bcrypt.hash(req.body.password, null, null, (bcErr, hash) => {
        if (bcErr) return console.error(bcErr);

        user.password = hash;

        user.save((err, user) => {
          if (err) return console.error(err);
          console.log(user.username + " signed up");
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

exports.showAll = (req, res) => {
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    res.render('showAll', {
      title: "showAll",
      config,
      state: getStateFromSession(req.session),
      users
    })
  });
}