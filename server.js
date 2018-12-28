// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://edgar:ficaparaoano19@ds024548.mlab.com:24548/sic_encomendas_db'); // connect to our database

var cors = require('cors');
app.use(cors());

var Encomenda = require('./app/models/Encomenda');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// Require service modules.
var EncomendaService = require('./app/service/EncomendaService');
var ItemProdutoService = require('./app/service/ItemProdutoService');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /encomendas
// ----------------------------------------------------
router.route('/encomendas')

    // create a encomenda (accessed at POST http://localhost:8080/api/encomendas)
    .post(EncomendaService.postEncomenda)

    // get all the encomendas (accessed at GET http://localhost:8080/api/encomendas)
    .get(EncomendaService.getAllEncomendas);

// on routes that end in /encomendas/:encomenda_id
// ----------------------------------------------------
router.route('/encomendas/:encomenda_id')

    // get the encomenda with that id (accessed at GET http://localhost:8080/api/encomendas/:encomenda_id)
    .get(EncomendaService.getEncomenda)

    // update the encomenda with this id (accessed at PUT http://localhost:8080/api/encomendas/:encomenda_id)
    .put(EncomendaService.putEncomenda)

    // delete the encomenda with this id (accessed at DELETE http://localhost:8080/api/encomendas/:encomenda_id)
    .delete(EncomendaService.deleteEncomenda);

// on routes that end in /encomendas/:encomenda_id
// ----------------------------------------------------
router.route('/encomendasDetails/:encomenda_id')

    // update the encomenda details with this id (accessed at PUT http://localhost:8080/api/encomendasDetails/:encomenda_id)
    .put(EncomendaService.putEncomendaDetails)

// on routes that end in /encomendas/:encomenda_id/itens
// ----------------------------------------------------
router.route('/encomendas/:encomenda_id/itens')

    // get the itensproduto from encomenda(accessed at GET http://localhost:8080/api/encomendas/:encomenda_id/itens)
    .get(EncomendaService.getItensEncomenda)

// on routes that end in /encomendas/:encomenda_id/itens
// ----------------------------------------------------
router.route('/encomendas/:encomenda_id/itens/:itemproduto_id')

    // get the itemproduto from encomenda with that id (accessed at GET http://localhost:8080/api/encomendas/:encomenda_id/itens/itemproduto_id)
    .get(EncomendaService.getItemEncomenda)

    // update the encomenda details with this id (accessed at PUT http://localhost:8080/api/encomendasDetails/:encomenda_id)
    .put(ItemProdutoService.putEncomendaItemProduto)

    // update the encomenda details with this id (accessed at PUT http://localhost:8080/api/encomendasDetails/:encomenda_id)
    .post(ItemProdutoService.postEncomendaItemProduto)

    // get the itemproduto from encomenda with that id (accessed at DELETE http://localhost:8080/api/encomendas/:encomenda_id/itensProduto/itemproduto)
    .delete(ItemProdutoService.deleteItemEncomenda);


// on routes that end in /itemproduto
// ----------------------------------------------------
router.route('/itemproduto')

    // get all the itemprodutos (accessed at GET http://localhost:8080/api/itemproduto)
    .get(ItemProdutoService.getAllItemProdutos);

// on routes that end in /itemproduto/:itemproduto_id
// ----------------------------------------------------
router.route('/itemproduto/:itemproduto_id')

    // get the itemproduto with that id (accessed at GET http://localhost:8080/api/itemproduto/:itemproduto_id)
    .get(ItemProdutoService.getItemProduto)

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
