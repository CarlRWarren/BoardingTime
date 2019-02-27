exports.index = (req, res) => {
    res.render('index', {
        title: "Home Page"
    });
}

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