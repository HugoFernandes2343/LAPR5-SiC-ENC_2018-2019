var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var ItemProduto = require('../models/ItemProduto');
var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var EncomendaRepository = require('../repository/EncomendaRepository');
var Restricao = require('../models/Restricao');
const fetch = require('node-fetch');

exports.getAllItemProdutos = async function (req, res) {

    await ItemProdutoRepository.getAllItemProdutos(res);

}

exports.getItemProduto = async function (req, res) {

    await ItemProdutoRepository.getItemProduto(req, res);

}

exports.deleteItemEncomenda = async function (req, res) {

    await EncomendaRepository.editEncomendaDelete(req.params.itemproduto_id, req.params.encomenda_id,res);
    await ItemProdutoRepository.deleteItemEncomenda(req.params.itemproduto_id, req.params.encomenda_id, res);
    res.json({ message: 'Successfully deleted!' });

}

exports.putEncomendaItemProduto = async function (req, res) {

    await ItemProdutoRepository.deleteItemEncomenda(req.params.itemproduto_id, req.params.encomenda_id, res);

    var listPartes = new Array();
    var aux;
    var produto;
    var count2 = 0;

    var url = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.nome;
    await fetch(url).then(res => res.json())
        .then(json =>
            aux = json
        );

    produto = await switchToItemProduto(aux);

    var package = {
        alturaproduto: req.body.altura,
        profundidadeproduto: req.body.profundidade,
        larguraproduto: req.body.largura,
        larguramaxproduto: produto.larguraMax,
        larguraminproduto: produto.larguraMin,
        alturamaxproduto: produto.alturaMax,
        alturaminproduto: produto.alturaMin,
        profundidademaxproduto: produto.profundidadeMax,
        profundidademinproduto: produto.profundidadeMin,
        maxtaxaocupacao: produto.maxTaxaOcupacao,
        taxaatual: produto.taxaOcupacaoObrigatoria,
        materialProdutoId: req.body.materiaisAcabamentos,
        larguraparte: 0,
        alturaparte: 0,
        profundidadeparte: 0,
        materialPartes: []
    };

    if (await Restricao.checkDimensao(package)) {

        for (j = 0; j < req.body.partesOpcionais.length; j++) {
            var aux2;
            var parte;
            var url2 = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.partesOpcionais[j];
            await fetch(url2).then(res => res.json())
                .then(json =>
                    aux2 = json
                );

            parte = await switchToItemProduto(aux2);

            package.larguraparte = parte.largura;
            package.alturaparte = parte.altura;
            package.profundidadeparte = parte.profundidade;
            package.materialPartes = parte.materiaisAcabamentos;

            if (await Restricao.checkMaterial(package) && await Restricao.checkCaber(package) && await Restricao.checkOcupacao(package)) {
                listPartes.push(parte.nome);
                count2++;
            }

        }

    }

    if (count2 == req.body.partesOpcionais.length) {
        produto.partesOpcionais = listPartes;
        produto.altura = req.body.altura;
        produto.profundidade = req.body.profundidade;
        produto.largura = req.body.largura;
        produto.materiaisAcabamentos = req.body.materiaisAcabamentos;
        produto.encomendaId = req.params.encomenda_id;
        await ItemProdutoRepository.saveItemProduto(produto,res);
    }

    res.json({ message: 'Item Produto updated!' });

}

exports.postEncomendaItemProduto = async function (req, res) {

    var listPartes = new Array();
    var aux;
    var produto;
    var count2 = 0;

    var url = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.nome;
    await fetch(url).then(res => res.json())
        .then(json =>
            aux = json
        );

    produto = await switchToItemProduto(aux);

    var package = {
        alturaproduto: req.body.altura,
        profundidadeproduto: req.body.profundidade,
        larguraproduto: req.body.largura,
        larguramaxproduto: produto.larguraMax,
        larguraminproduto: produto.larguraMin,
        alturamaxproduto: produto.alturaMax,
        alturaminproduto: produto.alturaMin,
        profundidademaxproduto: produto.profundidadeMax,
        profundidademinproduto: produto.profundidadeMin,
        maxtaxaocupacao: produto.maxTaxaOcupacao,
        taxaatual: produto.taxaOcupacaoObrigatoria,
        materialProdutoId: req.body.materiaisAcabamentos,
        larguraparte: 0,
        alturaparte: 0,
        profundidadeparte: 0,
        materialPartes: []
    };

    if (await Restricao.checkDimensao(package)) {

        for (j = 0; j < req.body.partesOpcionais.length; j++) {
            var aux2;
            var parte;
            var url2 = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.partesOpcionais[j];
            await fetch(url2).then(res => res.json())
                .then(json =>
                    aux2 = json
                );

            parte = await switchToItemProduto(aux2);

            package.larguraparte = parte.largura;
            package.alturaparte = parte.altura;
            package.profundidadeparte = parte.profundidade;
            package.materialPartes = parte.materiaisAcabamentos;

            if (await Restricao.checkMaterial(package) && await Restricao.checkCaber(package) && await Restricao.checkOcupacao(package)) {
                listPartes.push(parte.nome);
                count2++;
            }

        }

    }

    if (count2 == req.body.partesOpcionais.length) {
        produto.partesOpcionais = listPartes;
        produto.altura = req.body.altura;
        produto.profundidade = req.body.profundidade;
        produto.largura = req.body.largura;
        produto.materiaisAcabamentos = req.body.materiaisAcabamentos;
        produto.encomendaId = req.params.encomenda_id;
        await EncomendaRepository.editEncomenda(produto,req,res);
        await ItemProdutoRepository.saveItemProduto(produto,res);
    }

    res.json({ message: 'Item Produto saved!' });

}

function switchToItemProduto(data) {

    var itemProduto = new ItemProduto();
    itemProduto.produtoId = data.id;
    itemProduto.nome = data.nome;
    itemProduto.custo = data.preco;
    itemProduto.categoria = data.categoria;
    itemProduto.restringirMateriais = data.restrigirMateriais;
    itemProduto.taxaOcupacaoObrigatoria = data.taxaOcupacaoAtual;
    itemProduto.taxaOcupacaoTotal = 0;
    itemProduto.maxTaxaOcupacao = data.maxTaxaOcupacao;
    itemProduto.partesObrigatorias = data.obrigatoria;
    itemProduto.altura = data.altura;
    itemProduto.alturaMax = data.alturaMax;
    itemProduto.alturaMin = data.alturaMin;
    itemProduto.largura = data.largura;
    itemProduto.larguraMax = data.larguraMax;
    itemProduto.larguraMin = data.larguraMin;
    itemProduto.profundidade = data.profundidade;
    itemProduto.profundidadeMax = data.profundidadeMax;
    itemProduto.profundidadeMin = data.profundidadeMin;
    itemProduto.materiaisAcabamentosId = data.materiaisAcabamentosId;
    itemProduto.partesObrigatorias = data.obrigatoria;

    return itemProduto;

}

