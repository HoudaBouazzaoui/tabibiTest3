const db = require('db/dbMysql2');
let consAuth = require("_const/auth");

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Adresse.findAll();
}

async function getById(id) {
    return await getAdresse(id);
}

async function create(params) {
    console.log('------------------DEB SERVICE ADRESSE---------------  create params=' + params);
    const adresse = new db.Adresse(params);
    console.log('------------------ SERVICE ADRESSE---------------  create adresse=' + adresse);
    // save adresse
    await adresse.save();
    console.log('------------------FIN SERVICE ADRESSE---------------  create');
    return adresse;
}

async function update(id, params) {
    const adresse = await getAdresse(id);
    // copy params to adresse and save
    Object.assign(adresse, params);
    await adresse.save();
}

async function _delete(id) {
    const adresse = await getAdresse(id);
    await adresse.destroy();
}

async function getAdresse(id) {
    const adresse = await db.Adresse.findByPk(id);
    if (!adresse) throw 'adresse not found';
    return adresse;
}

