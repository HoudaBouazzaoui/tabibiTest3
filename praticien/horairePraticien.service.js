const db = require('db/dbMysql2');

module.exports = {
    getHorairePraticien
    ,create
    ,update
    //,getById
    //,getAll
    //,delete: _delete
};

async function getHorairePraticien(id) {
    console.log('-----horairePraticien.service-----getHorairePraticien horairePraticienId=' + id);
    //return await getById(horairePraticienId);
    const horairePraticien = await db.HorairePraticien.findByPk(id);
    if (!horairePraticien) throw 'HorairePraticien not found!!';
    return horairePraticien;
}

async function getHorairePraticienOLD(req) {
    var praticien = req.payload.praticien;
    let horairePraticienId = praticien.HorairePraticienId;
    console.log('-----horairePraticien.service-----getHorairePraticien horairePraticienId=' + horairePraticienId);
    return await getById(horairePraticienId);
}

// todo a supp
async function create(params) {
    console.log('------------------DEB SERVICE horairePraticien---------------  create params=' + JSON.stringify(params));
    const horairePraticien = new db.HorairePraticien(params);
    console.log('------------------ SERVICE horairePraticien---------------  create horairePraticien=' + JSON.stringify(horairePraticien) );
    // save horairePraticien
    await horairePraticien.save();
    console.log('------------------FIN SERVICE horairePraticien---------------  create');
    return horairePraticien;
}

async function update(id, params) {
    console.log('------------------DEB SERVICE horairePraticien------  update id='+id+' params=' + JSON.stringify(params) );
    const horairePraticien = await getById(id);
    // copy params to horairePraticien and save
    Object.assign(horairePraticien, params);
    await horairePraticien.save();
    console.log('------------------FIN SERVICE horairePraticien------  update params=' + JSON.stringify(params));
}

async function getById(id) {
    const horairePraticien = await db.HorairePraticien.findByPk(id);
    if (!horairePraticien) throw 'HorairePraticien not found!';
    return horairePraticien;
}

// TODO ne sont pas appele
async function getAll() {
    return await db.HorairePraticien.findAll();
}

async function _delete(id) {
    const horairePraticien = await getById(id);
    await horairePraticien.destroy();
}