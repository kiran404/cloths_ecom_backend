const User = require('../models/user');
const jwt = require('jsonwebtoken');  // to generate signed token
const expressJwt = require('express-jwt');  // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.signup = (req, res) => {
    // console.log('req.body >>>>>>>> ', req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    // find the use base in email
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {   // find base on the email
        if (err || !user) {
            return res.status(400).json({
                err: "User with email does not exist, Please signUp"
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            })
        }


        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 })
        // return response with use and token to fronted client
        const { _id, name, email, role } = user    // destructure
        return res.json({ token, user: { _id, email, name, role } })   //destrructure
    })
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout Success' });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    console.log('Auth >>', req);
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user) {
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access Denied'
        });
    }
    next();
}