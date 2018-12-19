var router = require('express').Router();
var repository = require('../../repository/productRepository');
var productURL = require('../../utils/product/productURLs');
var authService = require('../../service/userService');

/**
 * Middleware that verifies authentication.
 */
router.use(function (req, res, next) {
    authService.verifyToken(req, res, next);
});

/**
 * Requests the product catalog for a product.
 */
router.get('/:id', function (req, response) {
    repository.findById(productURL.HTTPS + req.params.id, req, response);
});

/**
 * Requests all of the products in the catalog.
 */
router.get('/', function (req, response) {
    repository.findAll(productURL.HTTPS, req, response);
});

/**
 * Finds an item of a product
 */
router.get('/productitem/:id', function (req, response) {
    repository.findProductItem(req, response);
});

/**
 * Removes an item of a product.
 */
router.delete('/:id', function (req, response) {
    repository.remove(req, response);
});


module.exports = router;