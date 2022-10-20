//const config = require('utilisa/config.json');
const config = require('_const/db.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../utilisa/users/user.model')(sequelize);
    db.Patient = require('../patient/patient.model')(sequelize);

    db.Rdv = require('../rdvs/rdv.model')(sequelize);

    db.Praticien = require('../praticien/praticien.model')(sequelize);
    db.Adresse = require('../praticien/adresse.model')(sequelize);
    db.HorairePraticien = require('../praticien/horairePraticien.model')(sequelize);
    db.Profil = require('../praticien/profil.model')(sequelize);

    db.Praticien.belongsTo(db.Adresse);
    db.Praticien.hasMany(db.Patient, {as: 'patients'});
    db.Praticien.belongsTo(db.HorairePraticien);
    db.Praticien.belongsTo(db.Profil);

    db.Gestio = require('../gestio/gestio/gestio.model')(sequelize);
    db.Ville = require('../referentiels/ville.model')(sequelize);

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    //db.sequelize = sequelize;

    // sync all models with database
    await sequelize.sync({ alter: true });

}