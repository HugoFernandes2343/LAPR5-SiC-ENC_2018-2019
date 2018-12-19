var client = require('request');
var productBuilder = require('../utils/product/productBuilder');
var product = require('../model/product');

module.exports = {

    /**
     * Sends a request for all the products in the catalog 
     * and builds all of them in JSON response.
     * @param {the request url} requestURL 
     * @param {the request parameters} req 
     * @param {the response function} response 
     */
    findAll: function (requestURL, req, response) {
        client.get(requestURL, { json: true }, (err, res, body) => {

            if (err) {
                console.log(err);
            } else {
                var products = [];

                if (body == undefined || body.length == 0) {
                    response.status(404).json({ message: "There are no products in the catalog." });
                } else {

                    body.forEach(JSONProduct => {
                        var product = productBuilder.build(JSONProduct);
                        products.push(product);
                    });

                    if (products == []) {
                        response.status.send(500).json({
                            message: "Something went wrong while reading the json response."
                        });
                    } else {
                        response.status(200).json(products);
                    }
                }
            }
        });
    },

    /**
     * Send a request to the product catalog and builds
     * a product object with the response.
     * @param {the request url} requestURL 
     * @param {the request parameters} req 
     * @param {the response function} response 
     */
    findById: function (requestURL, req, response) {
        client.get(requestURL, { json: true }, (err, res, body) => {

            if (err) {
                console.log(err);
            } else {
                var parentProduct = productBuilder.build(body);
                if (parentProduct == null) response.status(404).json({ message: "There is no such product with id " + req.params.id });
                else response.status(200).json(parentProduct);
            }
        });
    },

    /**
     * Finds a product in the database by id.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findProductItem: function (req, res) {
        product.findById(req.params.id)
            .exec(function (err, product) {
                if (err) res.status(418).json({
                    message: "Our monkey developers have broken the website again.."
                        + "Please, drink this tea while we work on it."
                });
                else if (product == undefined || product == null || product.length == 0) res.status(404).json({ messsage: "There are no products with that id" });
                else res.status(200).send(product);
            });
    },

    /**
    * Finds the product with said Id and deletes it
    * from the database.
    * @param {the request parameters} req 
    * @param {the response function} res 
    */
    remove: function (req, res) {
        product.deleteOne({ _id: req.params.id }, function (err, order) {
            if (err) userService.internalError(res, err);
            else res.status(200).json({ message: "Successfully deleted product: " + order._id });
        });
    },
}