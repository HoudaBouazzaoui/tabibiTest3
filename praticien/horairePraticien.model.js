const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        matinDebut: { type: DataTypes.TIME},
        matinFin: { type: DataTypes.TIME},
        soirDebut: { type: DataTypes.TIME},
        soirFin: { type: DataTypes.TIME},
        lun: { type: DataTypes.BOOLEAN},
        mar: { type: DataTypes.BOOLEAN},
        mer: { type: DataTypes.BOOLEAN},
        jeu: { type: DataTypes.BOOLEAN},
        ven: { type: DataTypes.BOOLEAN},
        sam: { type: DataTypes.BOOLEAN},
        dim: { type: DataTypes.BOOLEAN}
    };
    return sequelize.define('HorairePraticien', attributes);
}