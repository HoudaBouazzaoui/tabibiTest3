const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        matinDebut: { type: DataTypes.TIME, allowNull: false },
        matinFin: { type: DataTypes.TIME, allowNull: false },
        soirDebut: { type: DataTypes.TIME, allowNull: false },
        soirFin: { type: DataTypes.TIME, allowNull: false },
        lun: { type: DataTypes.BOOLEAN, allowNull: false },
        mar: { type: DataTypes.BOOLEAN, allowNull: false },
        mer: { type: DataTypes.BOOLEAN, allowNull: false },
        jeu: { type: DataTypes.BOOLEAN, allowNull: false },
        ven: { type: DataTypes.BOOLEAN, allowNull: false },
        sam: { type: DataTypes.BOOLEAN, allowNull: false },
        dim: { type: DataTypes.BOOLEAN, allowNull: false }
    };
    return sequelize.define('HorairePraticien', attributes);
}