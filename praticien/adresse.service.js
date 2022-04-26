const db = require('db/dbMysql2');
let consAuth = require("_const/auth");
const Sequelize = require("sequelize");

module.exports = {
    getListePraticienByAdresse,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getListePraticienByAdresse(criterRch) {

    const id_speCat = criterRch.id_speCat;
    const specialite = criterRch.specialite;
    const villeRch = criterRch.ville;

    console.log('----DEB SERVICE ADRESSE--------getPraticienByAdresse ville=' + villeRch.length);
    console.log('----DEB SERVICE ADRESSE--------getPraticienByAdresse id_speCat=' + id_speCat.length);
    /*const praticiens = await db.Praticien.findAll({ include: [{
        model: db.Adresse, 
        as: 'Adresse',
        where: {
            ville: villeRch
          }
    }]});
    */
    const Op = Sequelize.Op;
    var praticiens = null;
    if (!villeRch.length && !id_speCat.length) {
        praticiens = await db.Praticien.findAll({
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: {
                    [Op.and]: [{ ville: villeRch }, { '$Praticien.id_speCat$': id_speCat }]
                }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    } else if (villeRch.length && id_speCat.length == 0) {
        praticiens = await db.Praticien.findAll({
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: { ville: villeRch }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    } else if (villeRch.length == 0 && id_speCat.length) {
        praticiens = await db.Praticien.findAll({
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: { '$Praticien.id_speCat$': id_speCat }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    }

    for (var i = 0; i < praticiens.length; i++) {
        const pra = praticiens[i];
        const pro = pra.Profil;
        if(pro != null) {
            pro.dataImg = Buffer.from(pro.dataImg).toString('base64');
        }    
    }

    console.log('----FIN SERVICE ADRESSE--------getPraticienByAdresse params=' + JSON.stringify(praticiens));
    if (!praticiens) throw 'praticien not found';
    return praticiens;
}

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

