var MenuCtrl = function() {
    var vm = this;

    vm.items = [
        {
            state: 'm',
            nombre: 'SPORTS'
        },
        {
            state: 'n',
            nombre: 'LIVE'
        },
        {
            state: 'b',
            nombre: 'PROP BUILDER'
        },
        {
            state: 'v',
            nombre: 'CASINO'
        },
        {
            state: 'x',
            nombre: 'VIP ACCESS'
        },
        {
            state: 'z',
            nombre: 'LOGOUT'
        }
    ];
};
module.exports = MenuCtrl;
