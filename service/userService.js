var jwt = require('jsonwebtoken');
var config = require('../app/config');
var user = require('../model/user');

module.exports = {

    /**
     * Validates the user token.
     * @param {the request parameters} req 
     * @param {the response function} res 
     * @param {the next function to execute} next 
     */
    verifyToken: function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) return res.status(401).json({ message: "Failed to authenticate token." });
                req.decoded = decoded;
                next();
            });
        } else {
            return res.status(403).json({ message: "No authorization token provided." });
        }
    },

    /**
     * Attempts to authenticate an user.
     * @param {the request parameters} req 
     * @param {the response function} res 
     * @param {the user} user 
     */
    authenticate: function (req, res, user) {
        if (user == undefined || user == null || user.length == 0) {
            res.status(404).json({ message: "Could not find user with given email." });
        } else {
            if (user.password != req.body.password) {
                res.status(401).json({ message: "Passwords do not match!" });
            } else {
                var token = jwt.sign({ email: user.email }, config.secret, { expiresIn: config.expireTime });
                res.status(200).json({ success: true, token: token });
            }
        }
    },

    /**
     * Attempts to register an user.
     * @param {the request parameters} params 
     * @param {the response function} res 
     * @param {query the user with the email to the database} userQueried;
     */
    register: function (res, userQueried, params) {
        //Verify if the email is already in use
        if (userQueried == null) {
            //Create the user to add
            var userInstance = new user({
                firstname: params.firstname, lastname: params.lastname,
                email: params.email, password: params.password
            });

            if (params.register_date != null) userInstance.register_date = params.register_date;

            //Add the user
            userInstance.save()
                .then(item => {
                    res.status(201).json({ message: "Great news, " + userInstance.firstname + "! Your account was created with success." });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong, we could not create the account! Please, try again." });
                });
        } else {
            res.status(400).json({ message: "The provided email is already in use." });
        }
    },

    /**
     * Logs the error to the terminal and sends a response to the client.
     * @param {the response function} res 
     * @param {the error} err 
     */
    internalError: function (res, err) {
        console.log(err);
        res.status(418).json({
            message: "Our monkey developers have broken the website again.."
                + "Please, drink this tea while we work on it."
        });
    },
}