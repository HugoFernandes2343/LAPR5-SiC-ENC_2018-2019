var router = require('express').Router();
var repository = require('../../repository/orderRepository');
var authService = require('../../service/userService');


/**
 * Middleware that verifies authentication.
 */
router.use(function (req, res, next) {
  authService.verifyToken(req, res, next);
});

/**
 * Returns all of the orders in the database.
 */
router.get('/', function (req, res) {
  repository.findAll(res);
});

/**
 * Returns an order given an Id.
 */
router.get('/:id', function (req, res) {
  repository.findById(req, res);
});

/**
 * Returns an item belonging to a product component list given an order.
 */
router.get('/:orderid/item/:itemid', function (req, res) {
  repository.findOrderItem(req, res);
});

/**
 * Adds a new order to the database.
 */
router.post('/', function (req, res) {
  repository.add(req, res);
});

/**
 * Edits an order in the database.
 */
router.put('/:id', function (req, res) {
  repository.edit(req, res);
});

/**
 * Removes an order from the database.
 */
router.delete('/:id', function (req, res) {
  repository.remove(req, res);
});

/**
 * Returns the items of a certain order
 */
router.get('/:id/items', function (req, res) {
  repository.findOrderItems(req, res);
});


module.exports = router;