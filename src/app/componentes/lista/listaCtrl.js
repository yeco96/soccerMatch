var listaCtrl = function () {
    var vm = this;
    vm.listaJuegos = [
        {
            id: '1',
            deporte: 'SOCCER',
            listaPaises: [
                {
                    nombrePais: 'Brazil',
                    ligas: [
                        {
                            id : 1,
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
                    nombrePais: 'Argentina',
                    ligas: [
                        {
                            id : 3,
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
            listaPaises: [
                {
                    nombrePais: 'Spain'
                },
                {
                    nombrePais: 'England'
                },
                {
                    nombrePais: 'Turkey'
                }
            ]
        },

        {
            id: '3',
            deporte: 'HOCKEY',
            listaPaises: [
                {
                    nombrePais: 'Rusia'
                },
                {
                    nombrePais: 'Canada'
                },
                {
                    nombrePais: 'Norway'
                }
            ]
        }
    ];
};
module.exports = listaCtrl;

