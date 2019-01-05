var Encomenda = require('../models/Encomenda');
var EncomendaRepository = require('../repository/EncomendaRepository');

exports.getAllEncomendas = async function (req, res) {

    await EncomendaRepository.getAllEncomendas(res);

}

exports.getEncomendasByUsername = async function (req, res) {

    await EncomendaRepository.getEncomendasByUsername(req.params.username, res);

}

exports.deleteEncomenda = async function (req, res) {

    await EncomendaRepository.deleteItensEncomenda(req, res);

    await EncomendaRepository.deleteEncomenda(req, res);

    res.json({ message: 'Successfully deleted!' });

}

exports.postEncomendaDetails = async function (req, res) {

    var encomenda = new Encomenda();
    encomenda._id = req.body.orderId;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.itens = [];

    await EncomendaRepository.saveEncomenda(encomenda, res);
    res.json({ message: 'Encomenda Details created!' });

}

exports.getEncomendaDetails = async function (req, res) {

    await EncomendaRepository.getEncomendaDetails(req, res);

}

exports.putEncomendaDetails = async function (req, res) {

    await EncomendaRepository.deleteEncomenda(req, res);

    var encomenda = new Encomenda();
    encomenda._id = req.body.orderId;
    encomenda.name = req.body.name;
    encomenda.date = req.body.date;
    encomenda.address = req.body.address;
    encomenda.itens = req.body.itens;

    await EncomendaRepository.saveEncomenda(encomenda, res);

    res.json({ message: 'Encomenda updated!' });
}