#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs');
var app = require('./app');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('certificates/ca.key', 'utf8');
var certificate = fs.readFileSync('certificates/ca.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/**
 * Use HTTP and HTTPS.
 */

var http = http.createServer(app);
var https = https.createServer(credentials, app);

/**
 * Listen on provided port, on all network interfaces.
 */

http.listen(8080);
https.listen(8081);

console.log("Listening HTTP on port 8080.");
console.log("Listening HTTPS on port 8081.");
