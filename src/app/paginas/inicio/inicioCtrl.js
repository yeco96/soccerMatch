require('angular');
var inicioCtrl = function () {
    var vm = this;
    
    vm.$onInit = function () {
    };
    
    vm.focus = function (id) {
        document.getElementById(id).focus();
    };

};
module.exports = inicioCtrl;