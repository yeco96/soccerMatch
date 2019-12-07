var angular = require('angular');
var inicioStates = require('./inicioStates');
var inicioCtrl = require('./inicioCtrl');
angular.module('app')
    .config(inicioStates).controller('inicioCtrl', inicioCtrl);