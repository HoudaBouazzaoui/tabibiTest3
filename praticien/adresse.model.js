const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        numero: { type: DataTypes.STRING(10), allowNull: false },
        voie: { type: DataTypes.STRING(255), allowNull: false },
        codePostale: { type: DataTypes.STRING(10), allowNull: false },
        ville: { type: DataTypes.STRING(100), allowNull: false },
        lat: { type: DataTypes.FLOAT(10, 6), allowNull: true },
        long: { type: DataTypes.FLOAT(10,6), allowNull: true }
    };
   
    return sequelize.define('Adresse', attributes);
}