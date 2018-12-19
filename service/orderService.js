var product = require('../model/product');
var productBuilder = require('../utils/product/productBuilder');
var productFits = require('../utils/product/productFits');

module.exports = {

    /**
     * A promise that:
     * Queries the database for all the products in an order.
     * @param {An order} order 
     */
    queryProducts: function (order) {
        return queryProducts = order.order_products.map(element =>
            new Promise((resolve, reject) => {
                product.findById(element._id)
                    .exec(function (err, body) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(productBuilder.buildMongoDBWithoutChildren(body));
                        }
                    });
            }));
    },

    /**
    * A promise that:
    * Queries the database for the product in an order with the given id.
    * @param {An order with product IDS} order 
    * @param {The item we want to search} itemid
    */
    queryProductById: function (order, itemid) {
        return queryProducts = new Promise((resolve, reject) => {
            product.findById(itemid)
                .exec(function (err, body) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(productBuilder.buildMongoDB(body));
                    }
                });
        });
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

    /**
     * Sends a 404 response to the client.
     * @param {the response function} res 
     */
    notFoundError: function (res) {
        res.status(404).json({ message: "There is no order with the provided id." });
    },

    /**
     * Checks if the childs have the materials & finishes required by the parent product
     * @param {Main Product} parent 
     * @param {Components} child 
     */
    checkMaterials: function (parent, child) {
        var validChildMaterials = false;
        child.prod_materials.forEach(child_mat => {
            parent.prod_childProdMaterialRestriction.forEach(parent_mat => {
                child_mat.material_finishes.forEach(child_finish => {
                    parent_mat.material_finishes.forEach(parent_finish => {

                        if (parent_mat.material_name == child_mat.material_name
                            && child_finish.finish_name == parent_finish.finish_name) {
                            validChildMaterials = true;
                        }
                    });
                });
            });
        });
        return validChildMaterials;
    },

    /**
     * Checks if the childs fit on the main product
     * @param {Main Product} parent 
     * @param {Component} childProd 
     */
    checkIfChildFits: function (parent, childProd) {
        var parent_volume = parent.prod_width * parent.prod_height * parent.prod_depth;
        var child_volume = childProd.prod_width * childProd.prod_height * childProd.prod_depth;
        var child_occupation_parent = child_volume / parent_volume * 100;
        var parent_occupation = parent.prod_currentOccupation;

        if (productFits.productFits(parent, childProd)) {

            parent_occupation += child_occupation_parent;

            parent.prod_currentOccupation = parent_occupation;

            return true;

        }

        console.log("hehe");
        return false;
    },

    /**
     * Checks if the current child is not a component of any
     * product already
     * @param {*} child 
     */
    checkChildParent: function (child) {
        if (child.prod_parentProd == null) return true;
        return false;
    },

    /**
     * Saves the order 
     * @param {Instance of the order} orderInstance  
     */
    saveOrder: function (orderInstance) {
        orderInstance.save()
            .then(item => { return true; })
            .catch((err) => { return false; });

        return true;
    },

    /**
     * Saves a product
     * @param {Product to save} product 
     */
    saveProduct: function (product) {
        product.save()
            .then(item => { return true; })
            .catch((err) => { console.log(err); return false; });

        return true;
    }
}