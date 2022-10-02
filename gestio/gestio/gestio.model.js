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

    // permet de ne pas returner l id mot de passe 
    const scopesPra = {
        //defaultScope: { where: { active: true } },
        scopes: {
            sansMotpasse: {
                attributes: { exclude: ['motpasse'] },
            },
            sansIds: {
                attributes: { exclude: ['id', 'motpasse', 'email'] },
            }
        }
    };

    return sequelize.define('Gestio', attributes, scopesPra);
}