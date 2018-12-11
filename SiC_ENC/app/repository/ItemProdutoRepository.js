var ItemProduto = require('../models/ItemProduto');
var ItemProdutoDTO = require('../views/ItemProdutoDTO');

class ItemProdutoRepository {

    async saveItemProduto(itemProduto, res) {

        // save the encomenda and check for errors
        await itemProduto.save(function (err) {
            if (err)
                res.send(err);

        });

    }

    async getAllItemProdutos(res) {

        // get all the encomendas
        return await ItemProduto.find(function (err, itemProdutos) {

            if (err)
                res.send(err);

            var list = new Array();

            for (var i = 0; i < itemProdutos.length; i++) {
                list.push(ItemProdutoDTO.createDTO(itemProdutos[i]));
            }
            res.send(list);
        });

    }

    async getItemProduto(req, res) {

        //get itemproduto by produtoid
        await ItemProduto.find({ produtoId: req.params.itemproduto_id }, function (err, itemProdutos) {
            if (err)
                res.send(err);

            var list = new Array();

            for (var i = 0; i < itemProdutos.length; i++) {
                list.push(ItemProdutoDTO.createDTO(itemProdutos[i]));
            }
            res.send(list);
        });
    }

    async deleteItemProduto(produto, idEncomenda, res) {

        //delete encomenda
        await ItemProduto.find({ nome: produto }, function (err, produtos) {
            if (err)
                res.send(err);

            for (var i = 0; i < produtos.length; i++) {
                if (produtos[i].encomendaId == idEncomenda) {
                    ItemProduto.remove({ _id: produtos[i]._id }, function (err) {
                        if (err)
                            res.send(err);
                    });
                }
            }

        });

    }

    async deleteItemEncomenda(produto, idEncomenda, res) {

        //delete itemProduto
        await ItemProduto.find({ produtoId: produto }, function (err, produtos) {
            if (err)
                res.send(err);

            for (var i = 0; i < produtos.length; i++) {
                if (produtos[i].encomendaId == idEncomenda) {
                    ItemProduto.remove({ _id: produtos[i]._id }, function (err) {
                        if (err)
                            res.send(err);
                    });
                }
            }

        });

    }

    async findItensProdutoByEncomenda(id, res) {

        await ItemProduto.find({ encomendaId: id }, function (err, produtos) {
            if (err)
                res.send(err);

            var list = new Array();

            for (var i = 0; i < produtos.length; i++) {
                list.push(ItemProdutoDTO.createDTO(produtos[i]));
            }

            res.json(list);
        })
    }

    async getItemEncomenda(idEncomenda, idProduto, req, res) {

        await ItemProduto.find({ encomendaId: idEncomenda }, function (err, produtos) {
            if (err)
                res.send(err);

            var result = false;

            for (var i = 0; i < produtos.length; i++) {
                if (produtos[i].produtoId == idProduto) {
                    res.json(ItemProdutoDTO.createDTO(produtos[i]))
                    result = true;
                }
            }

            if (!result) {
                res.json({ message: 'Item Produto not found!' });
            }
        })
    }

}

module.exports = new ItemProdutoRepository();