var assert = require('assert');
var product = require('../model/product');
var utils = require('../utils/product/productFits');
var orderService = require('../service/orderService');

/**
 * Tests the product class.
 */
describe('Product Class Tests', () => {

    /**
    * Creates a global product test in the database.
    */
    let parent, child;

    beforeEach((done) => {

        //Create materials & finishes here to test the material/finish restriction
        finishes = [];
        finishes.push({
            finish_name: "test",
            finish_desc: "test"
        });

        materials = [];
        materials.push({
            material_name: "test",
            material_desc: "test_desc",
            material_finishes: finishes
        });

        invalidFinishes = [];
        invalidFinishes.push({
            finish_name: "test fail",
            finish_desc: "test fail"
        });

        invalidMaterials = [];
        invalidMaterials.push({
            material_name: "test fail",
            material_desc: "test_desc fail",
            material_finishes: invalidFinishes
        });

        validMaterialsInvalidFinishes = [];
        validMaterialsInvalidFinishes.push({
            material_name: "test",
            material_desc: "test_desc",
            material_finishes: invalidFinishes
        });

        //Create a parent here so we can further test the restrictions.

        parent = new product({
            prod_name: 'Parent Product',
            prod_minOccupation: 0,
            prod_maxOccupation: 75,
            prod_height: 100,
            prod_heigtMax: 0,
            prod_width: 100,
            prod_widthMax: 0,
            prod_depth: 100,
            prod_depthMax: 0,
            prod_childProdMaterialRestriction: materials
        });

        //Child that will work as a component that fits in the product
        childFits = new product({
            prod_name: 'Child Product',
            prod_minOccupation: 0,
            prod_maxOccupation: 100,
            prod_height: 50,
            prod_heigtMax: 0,
            prod_width: 50,
            prod_widthMax: 0,
            prod_depth: 50,
            prod_depthMax: 0
        });

        //Child that will work as a component that fits in the product
        childNotFits = new product({
            prod_name: 'Child Product',
            prod_minOccupation: 0,
            prod_maxOccupation: 100,
            prod_height: 101,
            prod_heigtMax: 0,
            prod_width: 80,
            prod_widthMax: 0,
            prod_depth: 80,
            prod_depthMax: 0
        });

        //child with invalid materials to test parent material restrictions
        childInvalidMaterials = new product({
            prod_name: 'Child invalid materials',
            prod_materials: invalidMaterials
        });
        
        //child with valid materials to test parent material restrictions
        childValidMaterials = new product({
            prod_name: 'Child valid materials',
            prod_materials: materials
        });

        //child with invalid finishes to test parent material restrictions
        childInvalidFinishes = new product({
            prod_name: 'Child invalid finishes',
            prod_materials: validMaterialsInvalidFinishes
        });
        
        //child with invalid finishes to test parent material restrictions

        Promise.all([parent.save(), childFits.save(), childNotFits.save()])
            .then(() => done());
    });

    /**
     * Creates a product in the test database.
     */
    it('creates a product', (done) => {
        var testProduct = new product();
        testProduct.save()
            .then(() => {
                assert(!testProduct.isNew);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds a product by id.
     */
    it('finds a product by id.', (done) => {
        product.findOne({ _id: parent._id })
            .then((productResult) => {
                assert(productResult._id.toString() == parent._id.toString());
                assert(productResult.prod_name == parent.prod_name);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds all the products.
     */
    it('finds all the products', (done) => {
        product.find()
            .then((products) => {
                assert(products.length == 3);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Removes a product by id.
     */
    it('removes a product', (done) => {
        //Does the product exist?
        product.findOne({ _id: parent._id })
            .then((productResult) => {
                //Then remove it
                product.deleteOne({ _id: productResult._id })
                    //If it doesn't exist anymore, success!
                    .then(() => product.findOne({ _id: parent._id }))
                    .then((product) => {
                        assert(product == null);
                        done();
                    })
                    .catch((err) => { assert.fail(err); });
            })
            .catch((err) => { assert.fail(err) });
    });

    /**
     * Verifies if the restriction methods are working as intended.
     */
    it('verifies the \'product fits\' restriction', (done) => {
        /**
         * This componenent should not fit as its measures are too big
         * for the parent product.
         */
        if (utils.productFits(parent, childNotFits)) {
            assert.fail("This child should not fit the parent, as its measures are too big!");
        }

        /**
         * This component should fit 6 times in the product, as it's
         * measures fit in the parent, so the only thing left to check
         * is the occupation.
         */
        if (utils.productFits(parent, childFits)) {

            /**
            * Each products takes 12,5% volume, and since we already
            * added one we're currently at 12,5% occupation.
            * To reach the occupation limit of 75% we need to add
            * 75%/12,5% products, which gives us: 6 products total.
            * So, we need to add 5 more products to reach the limit,
            * and 6 more products to exceed the maximum threshold.
            */
            for (var i = 0; i < 6; i++) {
                parent.prod_childProds.push(childFits);
            }

            /**
             * Since we already maxed out the 75% threshold,
             * this component should not fit in the parent product.
             */
            if (utils.productFits(parent, childFits)) {
                assert.fail("On the second time around, the child product shouldn't fit.");
            }
        } else {
            assert.fail("The product should fit.");
        }
        done();
    });

    /**
     * Verifies if the materials restriction methods are working as intended.
     */
    it('verifies the \'material restriction\' restriction', (done) => {
        
        var invalidMaterial = orderService.checkMaterials(parent,childInvalidMaterials);
        assert.equal(invalidMaterial,false);

        var invalidFinishes = orderService.checkMaterials(parent,childInvalidFinishes)
        assert.equal(invalidFinishes,false);

        var valid = orderService.checkMaterials(parent,childValidMaterials);
        assert.equal(valid,true)
        
        done();
    });

});

