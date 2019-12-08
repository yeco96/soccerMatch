var listaCtrl = function() {
    var vm = this;
    vm.listaJuegos = [
        {
            id: '1',
            name: 'BEISBOL', 
            sub: ['MEXICO', 'BRAZIL']
        },
        {
            id: '2',
            name: 'HOCKEY', 
            sub: ['DINAMARCA', 'CANADA']
        },
        {
            id: '3',
            name: 'TENIS', 
            sub: ['POLONIA', 'RUSIA']
        }
    ];
};
module.exports = listaCtrl;

