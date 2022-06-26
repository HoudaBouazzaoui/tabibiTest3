const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        titre: { type: DataTypes.STRING(5), allowNull: false },
        nom: { type: DataTypes.STRING(100), allowNull: false },
        prenom: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false },
        motpasse: { type: DataTypes.STRING(100), allowNull: false },
        role: { type: DataTypes.STRING(10), allowNull: false }
    };
    
    return sequelize.define('Gestio', attributes);
}