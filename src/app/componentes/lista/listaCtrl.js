var listaCtrl = function () {
    var vm = this;
    vm.listaJuegos = [
        {
            id: '1',
            deporte: 'SOCCER',
            icon: 'fas fa-futbol',
            listaPaises: [
                {
                    icon : 'fab fa-font-awesome-flag',
                    nombrePais: 'Brazil',
                    ligas: [
                        {
                            id : 1,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'LIGA A',
                            juegos: [
                                {
                                    equipoA: 'EQUIPO A',
                                    equipoB: 'EQUIPO B'
                                }
                            ]
                        },
                        {
                            id : 2,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'LIGA B',
                            juegos: [
                                {
                                    equipoA: 'EQUIPO X',
                                    equipoB: 'EQUIPO Z'
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
                            nombreLiga: 'LIGA Argenta',
                            juegos: [
                                {
                                    equipoA: 'EQUIPO A',
                                    equipoB: 'EQUIPO B'
                                }
                            ]
                        },
                        {
                            id : 4,
                            icon : 'fas fa-caret-right',
                            nombreLiga: 'LIGA Jugamos',
                            juegos: [
                                {
                                    equipoA: 'EQUIPO X',
                                    equipoB: 'EQUIPO Z'
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
                    nombrePais: 'Spain'
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
};
module.exports = listaCtrl;

