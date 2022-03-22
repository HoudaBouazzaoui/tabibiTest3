const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
/*
    const attributes = {
        EMAIL: { type: DataTypes.STRING, allowNull: false },
        MOTPASSE: { type: DataTypes.STRING, allowNull: false },
        TITRE: { type: DataTypes.STRING(5), allowNull: false },
        NOM: { type: DataTypes.STRING(100), allowNull: false },
        PRENOM: { type: DataTypes.STRING(100), allowNull: false },
        ROLE: { type: DataTypes.STRING(10), allowNull: false }
    };
*/
    const attributes = {
        phoneNumber : { type: DataTypes.STRING(20), allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING(5), allowNull: false },
        firstName: { type: DataTypes.STRING(100), allowNull: false },
        lastName: { type: DataTypes.STRING(100), allowNull: false },
        role: { type: DataTypes.STRING(10), allowNull: false }
    };
    
    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['MOTPASSE'] }
            //attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    //return sequelize.define('utilisateur', attributes, options);
    return sequelize.define('User', attributes, options);
}