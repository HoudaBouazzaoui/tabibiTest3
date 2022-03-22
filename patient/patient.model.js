const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        titre: { type: DataTypes.STRING(5), allowNull: false },
        nom: { type: DataTypes.STRING(100), allowNull: false },
        prenom: { type: DataTypes.STRING(100), allowNull: false },
        dateNaissance: { type: DataTypes.DATE, allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: true },// null peduis cretion depuis prise de rdv Praticien
        motpasse: { type: DataTypes.STRING(100), allowNull: true },// null peduis cretion depuis prise de rdv Praticien
        telephone: { type: DataTypes.STRING(20), allowNull: false }
    };
    
    //return sequelize.define('utilisateur', attributes, options);
    return sequelize.define('Patient', attributes);
}