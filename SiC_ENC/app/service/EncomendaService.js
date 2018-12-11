var Encomenda = require('../models/Encomenda');
var ItemProduto = require('../models/ItemProduto');
var EncomendaRepository = require('../repository/EncomendaRepository');
var ItemProdutoRepository = require('../repository/ItemProdutoRepository');
var Restricao = require('../models/Restricao');
const fetch = require('node-fetch');

exports.postEncomendaDetails = async function (req, res) {

    var encomenda = new Encomenda();
    encomenda._id = req.params.encomenda_id;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.cost = 0;
    encomenda.itens = [];

    await EncomendaRepository.saveEncomenda(encomenda, res);
    res.json({ message: 'Encomenda Details created!' });

}

exports.postEncomenda = async function (req, res) {

    var encomenda = new Encomenda();
    encomenda._id = req.body.encomendaId;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.itens = req.body.itens;

    var itens = new Array();
    var listPartes = new Array();

    var custo = 0;
    var count1 = 0;

    for (i = 0; i < req.body.itens.length; i++) {

        var aux;
        var produto;
        var count2 = 0;

        var url = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.itens[i];
        await fetch(url).then(res => res.json())
            .then(json =>
                aux = json
            );

        produto = await switchToItemProduto(aux);

        var package = {
            alturaproduto: req.body.produto[count1][0],
            profundidadeproduto: req.body.produto[count1][1],
            larguraproduto: req.body.produto[count1][2],
            larguramaxproduto: produto.larguraMax,
            larguraminproduto: produto.larguraMin,
            alturamaxproduto: produto.alturaMax,
            alturaminproduto: produto.alturaMin,
            profundidademaxproduto: produto.profundidadeMax,
            profundidademinproduto: produto.profundidadeMin,
            maxtaxaocupacao: produto.maxTaxaOcupacao,
            taxaatual: produto.taxaOcupacaoObrigatoria,
            materialProduto: req.body.produto[count1][3],
            larguraparte: 0,
            alturaparte: 0,
            profundidadeparte: 0,
            materialPartes: []
        };

        if (await Restricao.checkDimensao(package)) {

            for (j = 0; j < req.body.produto[i][4].length; j++) {
                var aux2;
                var parte;
                var url2 = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.produto[i][4][j];
                await fetch(url2).then(res => res.json())
                    .then(json =>
                        aux2 = json
                    );

                parte = await switchToItemProduto(aux2);

                package.larguraparte = parte.largura;
                package.alturaparte = parte.altura;
                package.profundidadeparte = parte.profundidade;
                package.materialPartesId = parte.materiaisAcabamentos;

                if (await Restricao.checkMaterial(package) && await Restricao.checkCaber(package) && await Restricao.checkOcupacao(package)) {
                    listPartes.push(parte.nome);
                    count2++;
                }

            }

        }

        if (count2 == req.body.produto[i][4].length) {
            produto.partesOpcionais = listPartes;
            produto.altura = req.body.produto[count1][0];
            produto.profundidade = req.body.produto[count1][1];
            produto.largura = req.body.produto[count1][2];
            produto.materiaisAcabamentos = req.body.produto[count1][3];
            itens.push(produto);
            count1++;
        }

    }

    if (count1 == encomenda.itens.length) {
        itens.forEach(element => {
            custo += element.custo;
            element.encomendaId = encomenda._id;
            ItemProdutoRepository.saveItemProduto(element);
        });
        encomenda.cost = custo;
        await EncomendaRepository.saveEncomenda(encomenda, res);
        res.json({ message: 'Encomenda created!' });
    } else {
        res.json({ message: 'Error : Encomenda not created!' });
    }

}

exports.getAllEncomendas = async function (req, res) {

    await EncomendaRepository.getAllEncomendas(res);

}

exports.getEncomenda = async function (req, res) {

    await EncomendaRepository.getEncomenda(req, res);

}

exports.deleteEncomenda = async function (req, res) {

    await EncomendaRepository.deleteItensEncomenda(req, res);

    await EncomendaRepository.deleteEncomenda(req, res);

    res.json({ message: 'Successfully deleted!' });

}

exports.putEncomenda = async function (req, res) {

    var encomenda = new Encomenda();
    encomenda._id = req.body.encomendaId;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.itens = req.body.itens;

    var itens = new Array();
    var listPartes = new Array();

    var custo = 0;
    var count1 = 0;

    for (i = 0; i < req.body.itens.length; i++) {

        var aux;
        var produto;
        var count2 = 0;

        var url = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.itens[i];
        await fetch(url).then(res => res.json())
            .then(json =>
                aux = json
            );

        produto = await switchToItemProduto(aux);

        var package = {
            alturaproduto: req.body.produto[count1][0],
            profundidadeproduto: req.body.produto[count1][1],
            larguraproduto: req.body.produto[count1][2],
            larguramaxproduto: produto.larguraMax,
            larguraminproduto: produto.larguraMin,
            alturamaxproduto: produto.alturaMax,
            alturaminproduto: produto.alturaMin,
            profundidademaxproduto: produto.profundidadeMax,
            profundidademinproduto: produto.profundidadeMin,
            maxtaxaocupacao: produto.maxTaxaOcupacao,
            taxaatual: produto.taxaOcupacaoObrigatoria,
            materialProdutoId: req.body.produto[count1][3],
            larguraparte: 0,
            alturaparte: 0,
            profundidadeparte: 0,
            materialPartesId: []
        };

        if (await Restricao.checkDimensao(package)) {

            for (j = 0; j < req.body.produto[i][4].length; j++) {
                var aux2;
                var parte;
                var url2 = 'http://arqsiedgarcatarinaluis.azurewebsites.net/api/Produto/nome=' + req.body.produto[i][4][j];
                await fetch(url2).then(res => res.json())
                    .then(json =>
                        aux2 = json
                    );

                parte = await switchToItemProduto(aux2);

                package.larguraparte = parte.largura;
                package.alturaparte = parte.altura;
                package.profundidadeparte = parte.profundidade;
                package.materialPartesId = parte.materiaisAcabamentosId;

                if (await Restricao.checkMaterial(package) && await Restricao.checkCaber(package) && await Restricao.checkOcupacao(package)) {
                    listPartes.push(parte.nome);
                    count2++;
                }

            }

        }

        if (count2 == req.body.produto[i][4].length) {
            produto.partesOpcionaisId = listPartes;
            produto.altura = req.body.produto[count1][0];
            produto.profundidade = req.body.produto[count1][1];
            produto.largura = req.body.produto[count1][2];
            produto.materiaisAcabamentosId = req.body.produto[count1][3];
            itens.push(produto);
            count1++;
        }

    }

    if (count1 == encomenda.itens.length) {

        await EncomendaRepository.deleteItensEncomenda(req, res);

        await EncomendaRepository.deleteEncomenda(req, res);

        encomenda.cost = custo;
        await EncomendaRepository.saveEncomenda(encomenda, res);

        for(var i=0 ; i<itens.length; i++) {
            custo += itens[i].custo;
            itens[i].encomendaId = encomenda._id;
            await ItemProdutoRepository.saveItemProduto(itens[i],res);
        }

        res.json({ message: 'Encomenda updated!' });
    } else {
        res.json({ message: 'Error : Encomenda not updated!' });
    }

}

exports.getItensEncomenda = async function (req, res) {

    await EncomendaRepository.getItensEncomenda(req.params.encomenda_id, res);

}

exports.getItemEncomenda = async function (req, res) {

    await ItemProdutoRepository.getItemEncomenda(req.params.encomenda_id, req.params.itemproduto_id, req, res);

}

exports.putEncomendaDetails = async function (req, res) {

    await EncomendaRepository.deleteEncomenda(req, res);

    var encomenda = new Encomenda();
    encomenda._id = req.body.encomendaId;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.cost = req.body.cost;
    encomenda.itens = req.body.itens;

    await EncomendaRepository.saveEncomenda(encomenda, res);

    res.json({ message: 'Encomenda updated!' });
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



