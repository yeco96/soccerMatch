var MenuCtrl = function() {
    var vm = this;

    vm.items = [
        {
            state: 'home',
            nombre: 'Principal'
        },
        {
            state: 'formulario',
            nombre: 'Agregar'
        },
        {
            state: 'filtro',
            nombre: 'Filtro'
        }
    ];
    };

module.exports = MenuCtrl;
