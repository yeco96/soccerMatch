require('angular');
require('angular-ui-router');

var app = angular.module('app', [
        'ui.router'
       ])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');

            $state.go('404', null, {
                location: false
            });
        });
    }).run(function($state){
        $state.go('inicio');
    });
    
var $app = document.querySelector('#app');

require('./componentes');
require('./paginas');
require('./api');
require('./common');

angular.element($app).ready(function() {
    angular.bootstrap($app, [app.name]);
});
