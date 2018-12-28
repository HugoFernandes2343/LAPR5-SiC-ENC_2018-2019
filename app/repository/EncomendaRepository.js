
var Encomenda = require('../models/Encomenda');
var EncomendaDTO = require('../views/EncomendaDTO');
var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var ItemProduto = require('../models/ItemProduto');

class EncomendaRepository {

    async saveEncomenda(encomenda, res) {

        // save the encomenda and check for errors
        await encomenda.save(function (err) {
            if (err)
                res.send(err);

        });

    }

    async getAllEncomendas(res) {

        // get all the encomendas
        return await Encomenda.find(function (err, encomendas) {

            if (err)
                res.send(err);

            var list = new Array();

            for (var i = 0; i < encomendas.length; i++) {
                list.push(EncomendaDTO.createDTO(encomendas[i]));
            }
            res.send(list);
        });

    }

    async getEncomenda(req, res) {

        //get encomenda by id
        await Encomenda.findById(req.params.encomenda_id, function (err, encomenda) {
            if (err)
                res.send(err);
            console.log(encomenda);
            res.json(EncomendaDTO.createDTO(encomenda));
        });
    }

    async deleteEncomenda(req, res) {

        //delete encomenda
        await Encomenda.remove({ _id: req.params.encomenda_id }, function (err) {
            if (err)
                res.send(err);

        });

    }

    async deleteItensEncomenda(req, res) {
        //get encomenda by id
        await Encomenda.findById(req.params.encomenda_id, function (err, encomenda) {
            if (err)
                res.send(err);

            for (var i = 0; i < encomenda.itens.length; i++) {
                ItemProdutoRepository.deleteItemProduto(encomenda.itens[i], req.params.encomenda_id, res);
            }

        });

    }

    async getItensEncomenda(id, res) {

        return await ItemProdutoRepository.findItensProdutoByEncomenda(id, res);
    }

    async editEncomenda(produto, req, res) {
        await Encomenda.findById(req.params.encomenda_id, function (err, encomenda) {

            if (err)
                res.send(err);

            encomenda.cost += produto.custo;
            encomenda.itens.push(produto.nome);

            encomenda.save(function (err) {
                if (err)
                    res.send(err);
            });
        });
    }

    async editEncomendaDelete(idProduto, idEncomenda, res) {
        await ItemProduto.find({ encomendaId: idEncomenda }, function (err, produtos) {
            if (err)
                res.send(err);

            var name = "";
            var custo = 0;

            for (var i = 0; i < produtos.length; i++) {
                if (produtos[i].produtoId == idProduto) {
                    name = produtos[i].nome;
                    custo = produtos[i].custo;
                }
            }

            Encomenda.findById(idEncomenda, function (err, encomenda) {

                if (err)
                    res.send(err);
    
                encomenda.cost -= custo;
                var index = encomenda.itens.indexOf(name);
                if (index > -1) {
                    encomenda.itens.splice(index, 1);
                }
    
                console.log(encomenda);
                encomenda.save(function (err) {
                    if (err)
                        res.send(err);
                });
            });
        })
    }

}

module.exports = new EncomendaRepository();