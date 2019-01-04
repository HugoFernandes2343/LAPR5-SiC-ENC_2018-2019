var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EncomendaSchema   = new Schema({
    
    _id: {type: String},
    name: String,
    date: String,
    address: String,
    itens: [{type : String}]
});

module.exports = mongoose.model('Encomenda', EncomendaSchema);