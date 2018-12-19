var user = require('../model/user');
var userService = require('../service/userService');

module.exports = {

    /**
     * Finds all of the users in the database.
     * @param {the response function} res 
     */
    findAll: function (res) {
        user.find()
            .exec(function (err, users) {
                if (err) {
                    userService.internalError(res, err);
                } else {

                    if (users == undefined || users.length == 0) {
                        res.status(404).send({ message: "There are no users in the database." });
                    } else {

                        //Convert user object to DTO in order to hide the password field
                        var userDtoList = [];

                        users.forEach(user => {
                            userDtoList.push({ firstname: user.firstname, lastname: user.lastname, email: user.email });
                        });

                        res.status(200).send(userDtoList);
                    }
                }
            });
    },

    /**
     * Finds an user given an Id.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findById: function (req, res) {
        user.findById(req.params.id)
            .exec(function (err, user) {

                if (err) {
                    userService.internalError(res, err);
                } else {
                    if (user == undefined || user == null || user.length == 0) {
                        res.status(404).json({ message: "There is no user with the provided email." });
                    } else {
                        //Convert user object to DTO in order to hide the password field
                        res.status(200).json({ firstname: user.firstname, lastname: user.lastname, email: user.email });
                    }
                }
            });
    },

    /**
     * Finds an user given an email.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findByEmail: function (req, res) {
        user.findOne({ email: req.params.email })
            .exec(function (err, user) {

                if (err) {
                    userService.internalError(res, err);
                } else {
                    if (user == undefined || user == null || user.length == 0) {
                        res.status(404).json({ message: "There is no user with the provided email." });
                    } else {
                        //Convert user object to DTO in order to hide the password field
                        res.status(200).json({ firstname: user.firstname, lastname: user.lastname, email: user.email });
                    }
                }
            });
    },


    /**
     * Adds an user to the database.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    add: function (req, res) {

        //Get the request body
        var params = req.body;

        if (req.body == undefined
            || params.firstname == undefined || params.lastname == undefined
            || params.email == undefined || params.password == undefined) {
            res.status(400).json({ message: "Could not add user: the request is missing parameters." });
        } else {
            //Verify if the user already exists.
            //If it doesn't, try to add it to the database.
            user.findOne({ email: params.email })
                .exec(function (err, userQueried) {
                    if (err) userService.internalError(res, err);
                    else userService.register(res, userQueried, params);
                });
        }
    },

    /**
     * Authenticates an user.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    login: function (req, res) {
        user.findOne({ email: req.body.email }, function (err, user) {
            if (err) userService.internalError(res, err);
            else userService.authenticate(req, res, user);
        });
    },

    /**
     * Finds the user with said Id and deletes it
     * from the database.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    remove: function (req, res) {
        user.deleteOne({ email: req.params.email }, function (err, user) {
            if (err) userService.internalError(res, err);
            else res.status(200).json({ message: "Successfully deleted user." });
        });
    },

    /**
     * Finds the user with said Id and
     * edits the user with the requested parameters.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    edit: function (req, res) {
        res.render('index', { title: 'User Edit' });
    }

}