var angular = require('angular');
var tablaCmp = require('./tablaCmp');
var tablaCtrl = require('./tablaCtrl');
require('./tabla.css');

angular.module('app')
    .controller('tablaCtrl', tablaCtrl)
    .component('tabla', tablaCmp);
