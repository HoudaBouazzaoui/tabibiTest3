const db = require('db/dbMysql2');

module.exports = {
    create,
    getHorairePraticien,
    getById,
    getAll,
    update,
    delete: _delete
};

async function create(params) {
    console.log('------------------DEB SERVICE horairePraticien---------------  create params=' + JSON.stringify(params));
    const horairePraticien = new db.HorairePraticien(params);
    console.log('------------------ SERVICE horairePraticien---------------  create horairePraticien=' + JSON.stringify(horairePraticien) );
    // save horairePraticien
    await horairePraticien.save();
    console.log('------------------FIN SERVICE horairePraticien---------------  create');
    return horairePraticien;
}
async function getHorairePraticien(req) {

    var praticien = req.payload.praticien;
    let horairePraticienId = praticien.HorairePraticienId;
    console.log('-----horairePraticien.service-----getHorairePraticien horairePraticienId=' + horairePraticienId);

    return await getById(horairePraticienId);
}

async function getById(id) {
    const horairePraticien = await db.HorairePraticien.findByPk(id);
    if (!horairePraticien) throw 'HorairePraticien not found';
    return horairePraticien;
}

async function getAll() {
    return await db.HorairePraticien.findAll();
}

async function update(id, params) {
    const horairePraticien = await getById(id);
    // copy params to horairePraticien and save
    Object.assign(horairePraticien, params);
    await horairePraticien.save();
}

async function _delete(id) {
    const horairePraticien = await getById(id);
    await horairePraticien.destroy();
}