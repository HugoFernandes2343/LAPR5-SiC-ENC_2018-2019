
var Encomenda = require('../models/Encomenda');
var EncomendaDTO = require('../views/EncomendaDTO');
var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var ItemProduto = require('../models/ItemProduto');

class EncomendaRepository {

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

    async getEncomendasByUsername(username, res) {

        // get all the encomendas
        return await Encomenda.find({ name: username }, function (err, encomendas) {

            if (err)
                res.send(err);

            var list = new Array();

            for (var i = 0; i < encomendas.length; i++) {
                list.push(EncomendaDTO.createDTO(encomendas[i]));
            }
            res.send(list);
        });

    }

    async deleteEncomenda(req, res) {

        //delete encomenda
        await Encomenda.remove({ _id: req.params.encomendaId }, function (err) {
            if (err)
                res.send(err);

        });

    }

    async deleteItensEncomenda(req, res) {
        //get encomenda by id
        await Encomenda.findById(req.params.encomendaId, function (err, encomenda) {
            if (err)
                res.send(err);

            for (var i = 0; i < encomenda.itens.length; i++) {
                ItemProdutoRepository.deleteItemProduto(encomenda.itens[i], req.params.encomendaId, res);
            }

        });

    }

    async saveEncomenda(encomenda, res) {

        // save the encomenda and check for errors
        await encomenda.save(function (err) {
            if (err)
                res.send(err);

        });

    }

    async getEncomendaDetails(req, res) {

        //get encomenda by id
        await Encomenda.findById(req.params.encomendaId, function (err, encomenda) {
            if (err)
                res.send(err);
            res.json(EncomendaDTO.createDTO(encomenda));
        });
    }

    async editEncomenda(produto, req, res) {
        await Encomenda.findById(req.params.encomendaId, function (err, encomenda) {

            if (err)
                res.send(err);

            encomenda.itens.push(produto.nome);

            encomenda.save(function (err) {
                if (err)
                    res.send(err);
            });
        });
    }
}

module.exports = new EncomendaRepository();