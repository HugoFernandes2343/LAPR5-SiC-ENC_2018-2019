var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemProdutoSchema   = new Schema({
    
    produtoId: String,
    encomendaId : String,
    nome: String,
    categoria: String,
    altura: Number,
    alturaMax: Number,
    profundidade: Number,
    profundidadeMax: Number,
    largura: Number,
    larguraMax: Number,
    materiaisAcabamentos: [{ type: String }],
    partesObrigatorias: [{ type: String }],
    partesOpcionais: [{ type: String }]

});

module.exports = mongoose.model('ItemProduto', ItemProdutoSchema);