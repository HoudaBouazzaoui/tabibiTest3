const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        numero: { type: DataTypes.STRING(10), allowNull: true },
        voie: { type: DataTypes.STRING(255), allowNull: true },
        codePostale: { type: DataTypes.STRING(10), allowNull: true },
        ville: { type: DataTypes.STRING(100), allowNull: true },
        lat: { type: DataTypes.FLOAT(10, 6), allowNull: true },
        long: { type: DataTypes.FLOAT(10,6), allowNull: true }
    };
   
    return sequelize.define('Adresse', attributes);
}