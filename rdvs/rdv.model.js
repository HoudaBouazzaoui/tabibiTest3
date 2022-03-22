const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        id_pra : { type: DataTypes.INTEGER, allowNull: false },
        id_pat : { type: DataTypes.INTEGER, allowNull: false },
        motif: { type: DataTypes.STRING, allowNull: false },
        dateDebut: { type: DataTypes.DATE, allowNull: false },
        dateFin: { type: DataTypes.DATE, allowNull: false }
    };
    return sequelize.define('Rdv', attributes);
}