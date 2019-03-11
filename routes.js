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
  time: Date,
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

User.find((dbErr, users) => {
  if (dbErr) return console.error(dbErr);

  if (!users.some(u => u.role === "admin")) {
    bcrypt.hash("pass", null, null, (bcErr, hash) => {
      if (bcErr) return console.error(bcErr);
      user = new User({
        username: "admin",
        avatarurl: "https://api.adorable.io/avatars/face/eyes2/nose2/mouth7/ff0000/300",
        role: "admin",
        password: hash
      });

      user.save((err, user) => {
        if (err) return console.error(err);
        console.log(user.username + " created");
      });
    });
  }
});

exports.index = (req, res) => {
  Message.find((dbErr, messages) => {
    if (dbErr) return console.error(dbErr);

    User.find((err, users) => {
      if (err) return console.error(err);

      messages.forEach(m => {
        user = users.find(u => u.username == m.username);
        m.avatarurl = user.avatarurl;
      });

      var graphdata = [];
      users.forEach(u => {
        graphUser = {
          imgUrl: u.avatarurl,
          messageCount: 0
        };

        messages.forEach(m => {
          if (m.username == u.username) {
            graphUser.messageCount++;
          }
        });

        graphdata.push(graphUser);
      });

      res.render("index", {
        title: "Home Page",
        session: req.session,
        config,
        state: getStateFromSession(req.session),
        messages,
        graphUser,
        loggedin: (req.session.user != null && req.session.user != undefined)
      });
    });

  });
};

exports.postMessage = (req, res) => {
  var message = new Message({
    username: req.session.user.username,
    message: req.body.message,
    time: new Date
  });

  message.save((err, message) => {
    if (err) return console.error(err);
    console.log(message.username + " posted " + message.message);
  });

  res.redirect('/');
}

exports.deleteMessage = (req, res) => {
  Message.findById(req.params.id, (dbErr, message) => {
    if (dbErr) return console.error(dbErr);

    if (message.username == req.session.user.username || req.session.user.isAdmin) {
      Message.findByIdAndDelete(req.params.id, (err, message) => {
        if (err) return console.error(err);

        console.log(`deleted message: ${message.message}`);

        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  });
}

exports.edit = (req, res) => {
  User.findById(req.session.user.id, (dbErr, user) => {
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
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);

    var user = users.find(u => u.id == req.session.user.id);
    console.log(user)
    var oldUsername = user.username;
    editUserFromReqBody(user, req.body);

    if (users.some(u => (u.username === user.username && u.id != req.session.user.id))) {
      res.render("signupEdit", {
        title: "",
        config,
        state: getStateFromSession(req.session),
        failedMessage: "username already in use",
        user,
        edit: true
      });
    } else {
      if (user.username != oldUsername) {
        req.session.user.username = user.username;
        updateUserReferences(user, oldUsername, () => {
          if (req.body.password) {
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
      } else {
        if (req.body.password) {
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
      }
    }


  });
}

updateUserReferences = (user, oldUsername, onFinished, index = 0) => {
  Message.find((dbErr, messages) => {
    if (dbErr) return console.error(dbErr);
    while (messages[index] && messages[index].username != oldUsername) {
      index++;
    }

    if (index >= messages.length) {
      onFinished();
    } else {
      messages[index].username = user.username;
      messages[index].save((err, message) => {
        if (err) return console.error(err);

        if (index >= messages.length) {
          onFinished();
        } else {
          updateUserReferences(user, oldUsername, onFinished, index + 1);
        }
      });
    }
  });
}

exports.delete = (req, res) => {
  var id = req.params.id;
  if (!id) {
    id = req.session.user.id;
  }
  User.findByIdAndDelete(id, (dbErr, user) => {
    if (dbErr) return console.error(dbErr);
    console.log(user.username + " deleted");

    res.redirect("/");
  });
};

exports.login = (req, res) => {
  res.render('login', {
    title: "Login Page",
    session: req.session,
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
            session: req.session,
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
        session: req.session,
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
    session: req.session,
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
        session: req.session,
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
          req.session.user = {
            isAuthenticated: true,
            username: req.body.username,
            id: user.id,
            isAdmin: (user.role === "admin")
          };
          res.redirect("/");
        });

      });
    }
  });
}

exports.admin = (req, res) => {
  User.find((dbErr, users) => {
    if (dbErr) return console.error(dbErr);
    res.render('admin', {
      title: "Admin",
      session: req.session,
      config,
      state: getStateFromSession(req.session),
      users
    });
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