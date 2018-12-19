var assert = require('assert');
var order = require('../model/order');
var user = require('../model/user');
var product = require('../model/product');

/**
 * Tests the order class.
 */
describe('Order Class Tests', () => {
    /**
     * Creates a global order with a product and an user
     * test in the database.
     */
    let john, productInstance, orderInstance;

    beforeEach((done) => {
        john = new user({ firstname: 'John', lastname: 'Doe', email: 'email1@email.com', password: 'whoknows' });
        productInstance = new product({ prod_name: 'Test Product' });
        orderInstance = new order({ order_user: john, order_products: productInstance });

        Promise.all([john.save(), productInstance.save(), orderInstance.save()])
            .then(() => done());
    });

    /**
     * Creates an order in the test database.
     */
    it('creates an order', (done) => {
        var testOrder = new order();
        testOrder.save()
            .then(() => {
                assert(!testOrder.isNew);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds an order by id.
     */
    it('finds an order by id', (done) => {
        order.findOne({ _id: orderInstance._id })
            .then((order) => {
                assert(order.order_user.toString() == john._id.toString());
                assert(order.order_products[0].toString() == productInstance._id.toString())
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds a product item in an order both by id.
     */
    it('finds a product item in an order both by id', (done) => {
        order.findOne({ _id: orderInstance._id })
            .then((order) => {
                product.findById(order.order_products[0]._id)
                    .then((product) => {
                        assert(product.prod_name == productInstance.prod_name);
                        done();
                    })
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds all the orders.
     */
    it('finds all the orders', (done) => {
        order.find()
            .then((orders) => {
                assert(orders.length == 1);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Removes an order by id.
     */
    it('removes an order', (done) => {
        //Does the order exist?
        order.findOne({ _id: orderInstance._id })
            .then((orderResult) => {
                //Then remove it
                order.deleteOne({ _id: orderResult._id })
                    //If it doesn't exist anymore, success!
                    .then(() => order.findOne({ _id: orderInstance._id }))
                    .then((order) => {
                        assert(order == null);
                        done();
                    })
                    .catch((err) => { assert.fail(err); });
            })
            .catch((err) => { assert.fail(err); });
    });


});

