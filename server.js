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

    // get all the encomendas (accessed at GET http://localhost:8080/api/encomendas)
    .get(EncomendaService.getAllEncomendas);

// on routes that end in /encomendas/user/:username
// ----------------------------------------------------
router.route('/encomendas/user/:username')

    // get encomendas by username (accessed at GET http://localhost:8080/api/encomendas/user/:username)
    .get(EncomendaService.getEncomendasByUsername);

// on routes that end in /encomendas/:encomendaId
// ----------------------------------------------------
router.route('/encomendas/:encomendaId')

    // delete the encomenda (accessed at DELETE http://localhost:8080/api/encomendas/:encomendaId)
    .delete(EncomendaService.deleteEncomenda);

// on routes that end in /encomendasDetails
// ----------------------------------------------------
router.route('/encomendasDetails')

    // post encomenda details (accessed at POST http://localhost:8080/api/encomendasDetails)
    .post(EncomendaService.postEncomendaDetails)

// on routes that end in /encomendasDetails/:encomendaId
// ----------------------------------------------------
router.route('/encomendasDetails/:encomendaId')

    // get the encomenda details (accessed at GET http://localhost:8080/api/encomendasDetails/:encomendaId)
    .get(EncomendaService.getEncomendaDetails)

    // put encomenda details (accessed at PUT http://localhost:8080/api/encomendasDetails/:encomendaId)
    .put(EncomendaService.putEncomendaDetails);

// on routes that end in /encomendasDetails/:encomendaId/itens
// ----------------------------------------------------
router.route('/encomendasDetails/:encomendaId/itens')

    // get encomenda itens (accessed at GET http://localhost:8080/api/encomendasDetails/:encomendaId/itens)
    .get(ItemProdutoService.getItensEncomenda)

    // post encomenda itens (accessed at POST http://localhost:8080/api/encomendasDetails/:encomendaId/itens)
    .post(ItemProdutoService.postItemEncomenda);

// on routes that end in /encomendasDetails/:encomendaId/itens/:itemId
// ----------------------------------------------------
router.route('/encomendasDetails/:encomendaId/itens/:itemName')

    // get encomenda item (accessed at GET http://localhost:8080/api/encomendasDetails/:encomendaId/itens/:itemId)
    .get(ItemProdutoService.getItemEncomenda)

    // put encomenda item (accessed at PUT http://localhost:8080/api/encomendasDetails/:encomendaId/itens/:itemId)
    .put(ItemProdutoService.putItemEncomenda);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
