var inicioStates = function ($stateProvider) {
    $stateProvider
        .state('inicio', {
            url: '/inicio',
            template: require('./template.html'),
            controller: 'inicioCtrl as ctrl'
        });
};

module.exports = inicioStates;
