const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {

    const attributes = {
        id_speCat: { type: DataTypes.STRING(10), allowNull: true },
        titre: { type: DataTypes.STRING(5), allowNull: true },
        nom: { type: DataTypes.STRING(100), allowNull: true },
        prenom: { type: DataTypes.STRING(100), allowNull: true },
        dateNaissance: { type: DataTypes.DATE, allowNull: true },
        email: { type: DataTypes.STRING(100), allowNull: true },
        motpasse: { type: DataTypes.STRING(100), allowNull: true },
        telephone: { type: DataTypes.STRING(20), allowNull: true },
        fax: { type: DataTypes.STRING(20), allowNull: true },
        valide: { type: DataTypes.BOOLEAN, allowNull: true },
        cr: { type: DataTypes.STRING(3), allowNull: true }
    };

    // permet de ne pas returner l id mot de passe 
    const scopesPra = {
        //defaultScope: { where: { active: true } },
        scopes: {
            sansMotpasse: {
                attributes: { exclude: ['motpasse'] },
            },
            sansIdMotpasse: {
                attributes: { exclude: ['id', 'motpasse'] },
            },
            public: {
                attributes: { exclude: ['id', 'motpasse', 'email', 'valide', 'cr', 'createdAt', 'updatedAt'] },
            }
        }
    };

    return sequelize.define('Praticien', attributes, scopesPra);
}