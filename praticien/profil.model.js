const { DataTypes } = require('sequelize');
module.exports = model;
function model(sequelize) {
    const attributes = {
        typeImg: {type: DataTypes.STRING(15)},
        nomImg: {type: DataTypes.STRING(255)},
        dataImg: {type: DataTypes.BLOB("long")}
    }; 
    return sequelize.define('Profil', attributes);
}