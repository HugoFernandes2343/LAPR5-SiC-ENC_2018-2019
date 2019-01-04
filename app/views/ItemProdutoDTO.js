class ItemProdutoDTO {

    createDTO(itemProduto) {

        return {
            idProduto: itemProduto.produtoId,
            nome: itemProduto.nome,
            categoria: itemProduto.categoria,
            altura: itemProduto.altura,
            profundidade: itemProduto.profundidade,
            largura: itemProduto.largura,
            materiaisAcabamentos: itemProduto.materiaisAcabamentos,
            partesOpcionais: itemProduto.partesOpcionais,
            partesObrigatorias: itemProduto.partesObrigatorias,
        }
    }
}

module.exports = new ItemProdutoDTO();