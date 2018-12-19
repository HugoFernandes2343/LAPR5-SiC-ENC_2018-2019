var Product = require('../model/product');
var productBuilder = require('../utils/product/productBuilder');
var productFits = require('../utils/product/productFits');
var orderService = require('../service/orderService');


module.exports = {
    /**
     * Attempts to create a new order in the database.
     * @param {a new order to add} orderInstance 
     * @param {the main product of the order} parentProduct 
     * @param {the order's product components} childrenProducts 
     * @param {the response function} response 
     */
    createOrder: function (orderInstance, parentProduct, childrenProducts, response) {
        Promise.resolve(parentProduct)
            .then((parentProduct) => {

                var parent_prod = new Product();
                var childProds = [];
                var validChilds = true;

                parent_prod = parentProduct;
                parent_prod.prod_currentOccupation = 0;

                Promise.all(childrenProducts)
                    .then((newProducts) => {

                        newProducts.forEach(child => {

                            var childProd = productBuilder.buildMongoDB(child);

                            if (!productValidation(parent_prod, childProd)) {
                                console.log("The product " + childProd._id + "is not valid");
                                validChilds = false;
                            }

                            childProds.push(childProd);
                            parent_prod.prod_childProds.push(childProd);
                        })


                    }).then(function () {
                        if (!validChilds) {
                            return response.status(400).send({ message: "Child products are not valid" });
                        }
                        else {
                            parent_prod.prod_childProds.forEach(child => {
                                orderService.saveProduct(child);
                            });
                        }

                        orderInstance.order_products.push(parent_prod);

                        var saveProd = orderService.saveProduct(parent_prod);
                        if (!saveProd) return response.status(418).send({ message: "The product couldn't be created" });

                        var createdOrder = orderService.saveOrder(orderInstance);

                        if (createdOrder)
                            response.status(201).json({
                                message: "The order has been successfully created",
                                order: orderInstance
                            });
                        else return response.status(400).send({ message: "The order couldn't be created" });
                    })
                    .catch((err) => {
                        console.log(err);
                    });


            }).catch((err) => {
                console.log(err);
            });
    }



}

/**
* Verifies if the component can be added to the parent.
* @param {the parent product} parent 
* @param {the parent's components} child 
*/
function productValidation(parent, child) {
    var valid = false;

    if (orderService.checkMaterials(parent, child))
        if (orderService.checkIfChildFits(parent, child))
            if (orderService.checkChildParent(child)) valid = true;

    return valid;
}

