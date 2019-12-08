var tablaCtrl = function ($scope) {
    var vm = this;

    vm.infoEquipo = 'col-md-4';
    vm.tablaDatos = 'col-md-12';

    $scope.$on('enviar-dato', function (event, dato) {
        vm.equipo = undefined;
        vm.tablaDatos = 'col-md-12';

        vm.list = dato.list;
        vm.pais = dato.pais;
        vm.liga = dato.liga;

        vm.titulo = vm.list.deporte + ' ' + vm.pais.nombrePais + ' ' + vm.liga.nombreLiga;
        vm.tituloTemp = vm.titulo;

        vm.liga.listaJuegos = [];
        vm.liga.listaJuegos.dato0 = Math.floor(Math.random() * 5);

        vm.liga.juegos.forEach(function (value) {

            vm.detalle = [];

            var a = value;

            var aleatorio70 = Math.floor(Math.random() * 70) + 10;
            var aleatorio200 = Math.floor(Math.random() * 200) + 100;
            var aleatorio150 = Math.floor(Math.random() * 150) + 100;

            var temp = {};

            temp.dato1 = aleatorio70;
            temp.nombre = a.equipoA;
            temp.numeroNe = aleatorio200;
            temp.numerPos = aleatorio150;
            temp.nombreU = '000';
            vm.detalle.push(temp);



            aleatorio70 = Math.floor(Math.random() * 70) + 10;
            aleatorio200 = Math.floor(Math.random() * 200) + 100;
            aleatorio150 = Math.floor(Math.random() * 150) + 100;


            temp = {};

            temp.dato1 = aleatorio70;
            temp.nombre = a.equipoB;
            temp.numeroNe = aleatorio200;
            temp.numerPos = aleatorio150;
            temp.nombreU = '000';
            vm.detalle.push(temp);

            vm.liga.listaJuegos.push(vm.detalle);
        });
        console.log(vm.liga);
    });

    vm.mostrarInfo = function (tabla) {
        vm.infoEquipo = 'col-md-4';
        vm.tablaDatos = 'col-md-8';
        vm.equipo = tabla.nombre;
    };

    vm.ocultarTabla = function (tabla) {
        vm.titulo = undefined;
        vm.tablaDatos = 'col-md-0';
        vm.infoEquipo = 'col-md-12';
        vm.equipo = tabla.nombre;
    };

    vm.mostrarTabla = function () {
        vm.equipo = undefined;
        vm.tablaDatos = 'col-md-12';
        vm.titulo = vm.tituloTemp;
    };




};
module.exports = tablaCtrl;
