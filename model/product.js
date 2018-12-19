var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    prod_dotnetid: Number,
    prod_name: String,
    prod_desc: String,
    prod_price: Number,
    prod_minOccupation: Number,
    prod_maxOccupation: Number,
    prod_currentOccupation: Number,
    prod_materials: [{
        material_name: String,
        material_desc: String,
        material_finishes: [{
            finish_name: String,
            finish_desc: String,
        }]
    }],
    prod_category: [{
        category_name: String,
    }],
    prod_height: Number,
    prod_heightMax: Number,
    prod_width: Number,
    prod_widthMax: Number,
    prod_depth: Number,
    prod_depthMax: Number,
    prod_parentProd: this,
    prod_childProds: [this],
    prod_childProdMaterialRestriction: [{
        material_name: String,
        material_finishes: [{
            finish_name: String,
            finish_desc: String,
        }]
    }],
});

module.exports = mongoose.model('Product', ProductSchema);