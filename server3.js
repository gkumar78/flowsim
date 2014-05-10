#!/usr/bin/env node

var program = require('commander');
var connect = require('connect');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address | process.env.ADDRESS || '127.0.0.1';

connect()
  .use(function(req, res, next) {
    res.end('lbah');
  })
  .listen(port, ip);
