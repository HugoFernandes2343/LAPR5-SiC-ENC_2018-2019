var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemProdutoSchema   = new Schema({
    
    produtoId: String,
    encomendaId : String,
    nome: String,
    custo: Number,
    categoria: String,
    altura: Number,
    alturaMax: Number,
    alturaMin: Number,
    profundidade: Number,
    profundidadeMax: Number,
    profundidadeMin: Number,
    largura: Number,
    larguraMax: Number,
    larguraMin: Number,
    restringirMateriais: Boolean,
    taxaOcupacaoObrigatoria: Number,
    taxaOcupacaoTotal: Number,
    maxTaxaOcupacao: Number,
    materiaisAcabamentos: [{ type: String }],
    partesObrigatorias: [{ type: String }],
    partesOpcionais: [{ type: String }]

});

module.exports = mongoose.model('ItemProduto', ItemProdutoSchema);