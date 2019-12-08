var listaCtrl = function ($scope, $rootScope) {
    var vm = this;
    vm.listaJuegos = [
        {
            id: '1',
            deporte: 'Soccer',
            icon: 'fas fa-futbol',
            listaPaises: [
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Brazil',
                    ligas: [
                        {
                            id : 1,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga A',
                            juegos: [
                                {
                                    equipoA: 'Equipo Bra',
                                    equipoB: 'Equipo FC'
                                },
                                {
                                    equipoA: 'Equipo Anona',
                                    equipoB: 'Equipo Segundo'
                                }
                            ]
                        },
                        {
                            id : 2,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga B',
                            juegos: [
                                {
                                    equipoA: 'FC Conca',
                                    equipoB: 'Tiro al Blanco'
                                }
                            ]
                        }
                    ]
                },
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Argentina',
                    ligas: [
                        {
                            id : 3,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga Argenta',
                            juegos: [
                                {
                                    equipoA: 'Equipo Ejemplo',
                                    equipoB: 'Grupo del gane'
                                }
                            ]
                        },
                        {
                            id : 4,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga Jugamos',
                            juegos: [
                                {
                                    equipoA: 'Equipo x',
                                    equipoB: 'Equipo y'
                                }
                            ]
                        }
                    ]
                }

            ]
        },

        {
            id: '2',
            deporte: 'BASKETBALL',
            icon: 'fas fa-basketball-ball',
            listaPaises: [
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Spain',
                    ligas: [
                        {
                            id : 5,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga Española',
                            juegos: [
                                {
                                    equipoA: 'Los Grandes',
                                    equipoB: 'Los Pequeños'
                                }
                            ]
                        },
                        {
                            id : 9,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'Liga vamos',
                            juegos: [
                                {
                                    equipoA: 'Los que siempre gana',
                                    equipoB: 'Los que siempre pierden'
                                }
                            ]
                        }
                    ]
                },
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'England'
                },
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Turkey'
                }
            ]
        },
        {
            id: '3',
            icon : 'fas fa-hockey-puck',
            deporte: 'HOCKEY',
            listaPaises: [
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Rusia'
                },
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Canada'
                },
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Norway'
                }
            ]
        }
    ];

    vm.enviarTabla = function (list, pais, liga) {
        var dato = [];
        dato.list = list;
        dato.pais = pais;
        dato.liga = liga;
        $rootScope.$broadcast('enviar-dato', dato, true);
    };


};
module.exports = listaCtrl;

