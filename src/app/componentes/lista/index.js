var angular = require('angular');
var listaCmp = require('./listaCmp');
var listaCtrl = require('./listaCtrl');
require('./lista.css');

angular.module('app')
    .controller('listaCtrl', listaCtrl)
    .component('lista', listaCmp);
