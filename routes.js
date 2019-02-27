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