const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        id_speCat : { type: DataTypes.STRING(10), allowNull: false },
        titre: { type: DataTypes.STRING(5), allowNull: false },
        nom: { type: DataTypes.STRING(100), allowNull: false },
        prenom: { type: DataTypes.STRING(100), allowNull: false },
        dateNaissance: { type: DataTypes.DATE, allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false },
        motpasse: { type: DataTypes.STRING(100), allowNull: false },
        telephone: { type: DataTypes.STRING(20), allowNull: false },
        fax: { type: DataTypes.STRING(20), allowNull: false },
        valide: { type: DataTypes.BOOLEAN, allowNull: false }
    };
    
    return sequelize.define('Praticien', attributes);
}