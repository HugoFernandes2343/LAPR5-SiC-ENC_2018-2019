var ProductConstructor = require('../../model/product');

module.exports = {
    /**
     * Given a JSON representation of a a product, creates a new product
     * object and fills all of its attributes with the data from the
     * json.
     * @param {json representation of a product} json 
     */
    build: function (json) {
        try {

            var product = new ProductConstructor();

            product.prod_dotnetid = json.id;
            product.prod_name = json.name;
            product.prod_desc = json.description;
            product.prod_price = json.price;
            product.prod_minOccupation = json.minOccupation;
            product.prod_maxOccupation = json.maxOccupation;
            product.prod_currentOccupation = json.occupation;

            var childRestrictions = [];

            if (json.restriction != null &&
                (json.restriction.childMaterialRestrictions != null ||
                json.restriction.childMaterialRestrictions != undefined)) {

                json.restriction.childMaterialRestrictions.forEach(res => {

                    var finishes = [];
                    res.finishes.forEach(finish => {
                        finishes.push({
                            finish_name: finish.name,
                            finish_desc: finish.description
                        });
                    });

                    var obj = {
                        material_name: res.name,
                        material_description: res.description,
                        material_finishes: finishes
                    };

                    childRestrictions.push(obj);
                });
            }

            product.prod_childProdMaterialRestriction = childRestrictions;

            json.materials.forEach(JSONMaterial => {

                var finishes = [];

                JSONMaterial.finishes.forEach(JSONFinish => {
                    finishes.push({
                        finish_name: JSONFinish.name,
                        finish_desc: JSONFinish.description
                    });
                });

                product.prod_materials.push({
                    material_name: JSONMaterial.name,
                    material_desc: JSONMaterial.description,
                    material_finishes: finishes
                });
            });

            product.prod_category.push({
                category_name: json.category.name
            });

            json.category.subCategories.forEach(JSONSubCategory => {
                product.prod_category.push({
                    category_name: JSONSubCategory.name
                });
            });

            product.prod_height = json.dimension.height.value;
            product.prod_heightMax = json.dimension.height.valueMax;
            product.prod_width = json.dimension.width.value;
            product.prod_widthMax = json.dimension.width.valueMax;
            product.prod_depth = json.dimension.depth.value;
            product.prod_depthMax = json.dimension.depth.valueMax;
            product.prod_parentProd = json.parentProduct;

            if (json.components.length == 0) product.prod_childProds = [];

            json.components.forEach(JSONComponent => {
                product.prod_childProds.push(this.build(JSONComponent));
            });

            return product;

        } catch (exception) {
            console.log(exception);
            return null;
        }
    },

    /**
    * Given a JSON representation from mongoDB of a product, creates a new product
    * object and fills all of its attributes with the data from the json.
    * @param {json representation of a product by mongodb} json 
    */
    buildMongoDB: function (json) {
        try {
            var product = new ProductConstructor();

            product._id = json._id;
            product.prod_name = json.prod_name;
            product.prod_desc = json.prod_desc;
            product.prod_price = json.prod_price;
            product.prod_minOccupation = json.prod_minOccupation;
            product.prod_maxOccupation = json.prod_maxOccupation;

            json.prod_materials.forEach(JSONMaterial => {

                var finishes = [];

                JSONMaterial.material_finishes.forEach(JSONFinish => {
                    finishes.push({
                        finish_name: JSONFinish.finish_name,
                        finish_desc: JSONFinish.finish_desc
                    });
                });

                product.prod_materials.push({
                    material_name: JSONMaterial.material_name,
                    material_desc: JSONMaterial.material_desc,
                    material_finishes: finishes
                });
            });

            json.prod_category.forEach(category => {
                product.prod_category.push({ category_name: category.category_name });
            });

            product.prod_height = json.prod_height;
            product.prod_heightMax = json.prod_heightMax;
            product.prod_width = json.prod_width;
            product.prod_widthMax = json.prod_widthMax;
            product.prod_depth = json.prod_depth;
            product.prod_depthMax = json.prod_depthMax;
            product.prod_parentProd = json.prod_parentProd;

            product.prod_childProds = [];

            if (json.prod_childProds.length == 0) product.prod_childProds = [];

            json.prod_childProds.forEach(JSONComponent => {
                product.prod_childProds.push(this.buildMongoDB(JSONComponent));
            });

            return product;

        } catch (exception) {
            console.log(exception);
            return null;
        }
    },

    /**
    * Given a JSON representation from mongoDB of a product, creates a new product
    * object and fills all of its attributes with the data from the json.
    * @param {json representation of a product by mongodb} json 
    */
    buildMongoDBWithoutChildren: function (json) {
        try {

            var product = new ProductConstructor();

            product._id = json._id;
            product.prod_name = json.prod_name;
            product.prod_desc = json.prod_desc;
            product.prod_price = json.prod_price;
            product.prod_minOccupation = json.prod_minOccupation;
            product.prod_maxOccupation = json.prod_maxOccupation;

            json.prod_materials.forEach(JSONMaterial => {

                var finishes = [];

                JSONMaterial.material_finishes.forEach(JSONFinish => {
                    finishes.push({
                        finish_name: JSONFinish.finish_name,
                        finish_desc: JSONFinish.finish_desc
                    });
                });

                product.prod_materials.push({
                    material_name: JSONMaterial.material_name,
                    material_desc: JSONMaterial.material_desc,
                    material_finishes: finishes
                });
            });

            json.prod_category.forEach(category => {
                product.prod_category.push({ category_name: category.category_name });
            });

            product.prod_height = json.prod_height;
            product.prod_heightMax = json.prod_heightMax;
            product.prod_width = json.prod_width;
            product.prod_widthMax = json.prod_widthMax;
            product.prod_depth = json.prod_depth;
            product.prod_depthMax = json.prod_depthMax;
            product.prod_parentProd = json.prod_parentProd;

            product.prod_childProds = [];

            return product;

        } catch (exception) {
            console.log(exception);
            return null;
        }
    }
}