var angular = require('angular');
var MenuCmp = require('./MenuCmp');
var MenuCtrl = require('./MenuCtrl');
require('./menu.css');

angular.module('usuariosApp')
    .controller('MenuCtrl', MenuCtrl)
    .component('menu', MenuCmp);
