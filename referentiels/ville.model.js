const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        ville: { type: DataTypes.STRING(50)},
        codePostale: { type: DataTypes.STRING(10), allowNull: true }
    };
   
    return sequelize.define('Ville', attributes);
}