var mongoose = require('mongoose');
var product = require('./product').schema;

var OrderSchema = new mongoose.Schema({
    order_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order_date: { type: Date, default: Date.now },
    order_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Order', OrderSchema);