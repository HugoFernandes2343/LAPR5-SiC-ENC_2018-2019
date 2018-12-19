var router = require('express').Router();
var repository = require('../../repository/userRepository');
var authService = require('../../service/userService');

/**
 * Attempts to register a new user to the database.
 */
router.post('/register', function (req, res) {
  repository.add(req, res);
});

/**
 * Attempts to authenticate an user.
 */
router.post('/login/', function (req, res) {
  repository.login(req, res);
});

/**
 * Middleware that verifies authentication.
 */
router.use(function (req, res, next) {
  authService.verifyToken(req, res, next);
});

/**
 * Returns all of the users in the database.
 */
router.get('/', function (req, res) {
  repository.findAll(res);
});

/**
 * Returns an user given an Id.
 */
router.get('/:id', function (req, res) {
  repository.findById(req, res);
});

/**
 * Returns an user given an email.
 */
router.get('/email/:email', function (req, res) {
  repository.findByEmail(req, res);
});

/**
 * Edits an user in the database.
 */
router.put('/:id', function (req, res) {
  repository.edit(req, res);
});

/**
 * Removes an user from the database.
 */
router.delete('/:email', function (req, res) {
  repository.remove(req, res);
});

module.exports = router;