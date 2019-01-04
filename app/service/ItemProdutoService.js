var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var ItemProduto = require('../models/ItemProduto');
var EncomendaRepository = require('../repository/EncomendaRepository');
var Restricao = require('../models/Restricao');
const fetch = require('node-fetch');


exports.getItensEncomenda = async function (req, res) {

    await ItemProdutoRepository.findItensProdutoByEncomenda(req.params.encomendaId, res);

}

exports.getItemEncomenda = async function (req, res) {

    await ItemProdutoRepository.getItemEncomenda(req.params.encomendaId, req.params.itemName, res);

}

exports.postItemEncomenda = async function (req, res) {

    var aux;
    var produto;

    var url = 'https://lapr5-gc.azurewebsites.net/api/product/search/' + req.body.name;
    await fetch(url).then(res => res.json())
        .then(json =>
            aux = json
        );

    produto = await switchToItemProduto(aux);

    var package = constructPackage(produto, req);

    if (await Restricao.checkDimensao(package)) {
        if (await Restricao.checkMateriaisAcabamentos(package, aux)) {

            for (j = 0; j < req.body.parts.length; j++) {

                var aux2;
                var url2 = 'https://lapr5-gc.azurewebsites.net/api/product/search/' + req.body.parts[j];
                await fetch(url2).then(res => res.json())
                    .then(json =>
                        aux2 = json
                    );

                if (await Restricao.checkParte(aux2.name, produto.nome)) {
                    produto.partesOpcionais.push(aux2.name);
                }

            }

            var aux3;

            var url = 'https://lapr5-gc.azurewebsites.net/api/combination';
            await fetch(url).then(res => res.json())
                .then(json =>
                    aux3 = json
                );

            for (var i = 0; i < aux3.length; i++) {
                if (aux3[i].containingProduct == produto.nome && aux3[i].required == true) {
                    produto.partesObrigatorias.push(aux3[i].containedProduct);
                }
            }

            if (produto.partesOpcionais.length == req.body.parts.length) {
                produto.altura = req.body.heigth;
                produto.profundidade = req.body.depth;
                produto.largura = req.body.width;
                produto.materiaisAcabamentos = req.body.materialsFinishes;
                produto.encomendaId = req.params.encomendaId;
                await EncomendaRepository.editEncomenda(produto, req, res);
                await ItemProdutoRepository.saveItemProduto(produto, res);
                res.json({ message: 'Item Produto saved!' });
            } else {
                res.json({ message: 'Invalid Parts!' });
            }

        } else {
            res.json({ message: 'Invalid Materials and Finishes!' });
        }

    } else {
        res.json({ message: 'Invalid Dimensions!' });
    }

}

exports.putItemEncomenda = async function (req, res) {


    var aux;
    var produto;

    var url = 'https://lapr5-gc.azurewebsites.net/api/product/search/' + req.params.itemName;
    await fetch(url).then(res => res.json())
        .then(json =>
            aux = json
        );

    produto = await switchToItemProduto(aux);

    var package = constructPackage(produto, req);

    if (await Restricao.checkDimensao(package)) {
        if (await Restricao.checkMateriaisAcabamentos(package, aux)) {

            for (j = 0; j < req.body.parts.length; j++) {

                var aux2;
                var url2 = 'https://lapr5-gc.azurewebsites.net/api/product/search/' + req.body.parts[j];
                await fetch(url2).then(res => res.json())
                    .then(json =>
                        aux2 = json
                    );

                if (await Restricao.checkParte(aux2.name, produto.nome)) {
                    produto.partesOpcionais.push(aux2.name);
                }

            }

            var aux3;

            var url = 'https://lapr5-gc.azurewebsites.net/api/combination';
            await fetch(url).then(res => res.json())
                .then(json =>
                    aux3 = json
                );

            for (var i = 0; i < aux3.length; i++) {
                if (aux3[i].containingProduct == produto.nome && aux3[i].required == true) {
                    produto.partesObrigatorias.push(aux3[i].containedProduct);
                }
            }

            if (produto.partesOpcionais.length == req.body.parts.length) {
                produto.altura = req.body.heigth;
                produto.profundidade = req.body.depth;
                produto.largura = req.body.width;
                produto.materiaisAcabamentos = req.body.materialsFinishes;
                produto.encomendaId = req.params.encomendaId;
                await ItemProdutoRepository.deleteItemEncomenda(req.params.itemName, req.params.encomendaId, res);
                await ItemProdutoRepository.saveItemProduto(produto, res);
                res.json({ message: 'Item Produto updated!' });
            } else {
                res.json({ message: 'Invalid Parts!' });
            }

        } else {
            res.json({ message: 'Invalid Materials and Finishes!' });
        }

    } else {
        res.json({ message: 'Invalid Dimensions!' });
    }

}

function switchToItemProduto(data) {

    var itemProduto = new ItemProduto();
    itemProduto.produtoId = data.productId;
    itemProduto.nome = data.name;
    itemProduto.categoria = data.category;
    itemProduto.altura = data.dimensions[0].height.value;
    itemProduto.alturaMax = data.dimensions[0].height.valueMax;
    itemProduto.largura = data.dimensions[0].width.value;
    itemProduto.larguraMax = data.dimensions[0].width.valueMax;
    itemProduto.profundidade = data.dimensions[0].depth.value;
    itemProduto.profundidadeMax = data.dimensions[0].depth.valueMax;

    return itemProduto;

}

function constructPackage(produto, data) {
    return {
        alturaproduto: data.body.heigth,
        profundidadeproduto: data.body.depth,
        larguraproduto: data.body.width,
        larguramaxproduto: produto.larguraMax,
        alturamaxproduto: produto.alturaMax,
        profundidademaxproduto: produto.profundidadeMax,
        materiaisAcabamentos: data.body.materialsFinishes
    }
}
