var order = require('../model/order');
var user = require('../model/user');
var orderService = require('../service/orderService');
var Product = require('../model/product');
var client = require('request');
var productURL = require('../utils/product/productURLs');
var productBuilder = require('../utils/product/productBuilder');
var productFits = require('../utils/product/productFits');
var createOrderService = require('../service/createOrderService');

module.exports = {

    /**
     * Finds all of the orders in the database.
     * @param {the response function} res 
     */
    findAll: function (res) {
        order.find()
            .exec(function (err, orders) {
                if (err) {
                    orderService.internalError(res, err);
                } else {
                    if (orders.length == 0) res.status(404).send({ message: "There are no orders in the database." });
                    else res.status(200).send(orders);
                }
            });
    },

    /**
     * Finds an order given an Id.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findById: function (req, res) {
        order.findById(req.params.id)
            .exec(function (err, order) {
                if (err) {
                    orderService.internalError(res, err);
                } else {

                    if (order == undefined || order == null || order.length == 0) {
                        orderService.notFoundError(res);
                    } else {
                        Promise.all(orderService.queryProducts(order))
                            .then(function (products) {
                                order.order_products = products;
                                res.status(200).json(order);
                            })
                            .catch(function (err) { orderService.internalError(res, err); });
                    }
                }
            });
    },

    /**
     * Searches for an item in the product components.
     * The product belongs to the order with the given Id.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findOrderItem: function (req, res) {
        order.findById(req.params.orderid)
            .exec(function (err, orders) {
                if (err) {
                    orderService.internalError(res, err);
                } else {

                    if (orders == undefined || orders == null || orders.length == 0) {
                        orderService.notFoundError(res);
                    } else {
                        if (orders.order_products == undefined || orders.order_products == null) {
                            res.status(404).json({ message: "There are no products in this order." });
                        } else {


                            new Promise((resolve, reject) => {
                                orders.order_products.forEach(id => {
                                    console.log(id + "||" + req.params.itemid);
                                    if (id == req.params.itemid) {
                                        orderService.queryProductById(orders, id)
                                            .then(function (orderProduct) { resolve(orderProduct) })
                                            .catch(function (err) { reject(err); });
                                    } else {
                                        reject("Invalid id.");
                                    }
                                });
                            })
                                .then((function (orderProduct) { res.status(200).json(orderProduct); }))
                                .catch(function (err) { orderService.internalError(res, err); });
                        }
                    }
                }
            });
    },

    /**
     * Adds an order to the database.
     * @param {the request parameters} req 
     * @param {the response function} response
     */
    add: function (req, response) {
        user.findOne({ email: req.body.user_email })
            .exec(function (err, user) {

                if (user == null || user == undefined) {
                    return response.status(400).json({ message: "User is not valid" });
                }

                var orderInstance = new order();
                orderInstance.order_user = user;
                var order_prods = req.body.order_products.split("{");
                var children_tree = new Array();
                var prods = order_prods[1].split("}");
                var prod_ids = prods[0].split(",");
                var parent_prod_array = [];

                parent_prod_array.push(prod_ids[0]);

                for (var i = 1; i < prod_ids.length; i++) {
                    var prod = prod_ids[i];
                    children_tree.push(prod);
                }

                var parentProduct = new Promise((resolve, reject) => {
                    client.get(productURL.HTTPS + parent_prod_array[0], { json: true }, (err, res, JSONProduct) => {
                        if (err) reject(err);
                        else {
                            if(JSONProduct == null || JSONProduct == undefined){
                                return response.status(400).send({ message: "Something went wrong..." });
                            }
                            else resolve(productBuilder.build(JSONProduct));
                        }
                    });
                });

                var childrenProducts = children_tree.map(id =>
                    new Promise((resolve, reject) => {
                        var id_array = [];
                        id_array = id.split(",");
                        var prod_id = id_array[0];

                        client.get(productURL.HTTPS + prod_id, { json: true }, (err, reso, JSONProduct) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (JSONProduct == undefined || JSONProduct == null) {
                                    return response.status(400).send({ message: "Something went wrong..." });
                                }
                                else{
                                    resolve(productBuilder.build(JSONProduct));
                                } 
                            }
                        });

                    }));

                createOrderService.createOrder(orderInstance, parentProduct, childrenProducts, response);
            });

    },

    /**
     * Finds the order with said Id and deletes it
     * from the database.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    remove: function (req, res) {
        order.deleteOne({ _id: req.params.id }, function (err, order) {
            if (err) userService.internalError(res, err);
            else res.status(200).json({ message: "Successfully deleted order: " + order._id  });
        });
    },

    /**
     * Finds the order with said Id and
     * edits the order with the requested parameters.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    edit: function (req, res) {
        throw err;
    },

    /**
     * Finds the items of a given order
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findOrderItems: function (req, res) {
        order.findById(req.params.id)
            .exec(function (err, orders) {
                if (err) {
                    console.log(err);
                }
                else {

                    if (orders == null) res.status(400).json({ message: "Something went wrong..." });

                    var parent_product = orders.order_products[0];

                    if (parent_product == null) res.status(200).json({ message: "The order has no products" });

                    var prods = [];
                    var children = parent_product.prod_childProds;
                    prods.push(parent_product);

                    if (children != null) {
                        children.forEach(child => {
                            prods.push(child);
                        });
                    }

                    if (prods != null) {
                        res.status(200).json(prods);
                    }
                }

            });
    },

    /**
     * Finds the order in which the given product is in.
     * @param {the request parameters} req 
     * @param {the response function} res 
     */
    findItemOfProduct: function (req, res) {
        Product.findById(req.params.id)
            .exec(function (err, product) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Bad request" });
                }
                else {
                    if (product == null) res.status(404).json({ message: "The are no products with that id" });
                    else {
                        order.find().exec(function (err, orders) {
                            if (orders.length == 0) res.status(404).send({ message: "There are no orders" });
                            else {
                                var prod_orders = [];
                                orders.forEach(order => {
                                    console.log(order.order_products);
                                    order.order_products.forEach(prod => {
                                        if (prod == product) {
                                            prod_orders.push(order);
                                        }
                                    });
                                });
                                if (prod_orders.length == 0) {
                                    res.status(404).json({ message: "There are no orders with this product" });
                                }
                                else {
                                    var obj = {
                                        product_id: product._id,
                                        product_name: product.prod_name,
                                        orders: prod_orders
                                    };
                                    res.status(200).json(obj);
                                }
                            }
                        });
                    }
                }
            });
    }

}

