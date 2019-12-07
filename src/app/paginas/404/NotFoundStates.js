var NotFoundStates = function($stateProvider) {
    $stateProvider
        .state('404', {
            template: require('./template.html')
        });
};

module.exports = NotFoundStates;
