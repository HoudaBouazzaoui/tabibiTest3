const db = require('db/dbMysql2');
let consAuth = require("_const/auth");
let cst = require("_const/cst");
const Sequelize = require("sequelize");
const specialiteService = require('../specialite/specialite.service');

module.exports = {
    getListePraticienByAdresse
    ,update
    ,create 
    //,getAll
    //,getById 
    //,delete: _delete
};

async function getListePraticienByAdresse(criterRch, origi) {

    const id_speCatRch = criterRch.id_speCat;
    const specialite = criterRch.specialite;
    const villeRch = criterRch.ville;
    var scopePrati = 'public';

    if(origi && origi == cst.user.G){
        scopePrati = 'sansMotpasse';
    }else{
        scopePrati = 'public';
    }  

    console.log('----DEB SERVICE ADRESSE ECH PRA---origi='+origi+'-----getPraticienByAdresse ville=' + villeRch.length);
    console.log('----DEB SERVICE ADRESSE ECH PRA----origi='+origi+'----getPraticienByAdresse id_speCat=' + id_speCatRch.length);
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
    if (villeRch.length && id_speCatRch.length) { // rch ville + specialite
        console.log('---- SERVICE ADRESSE ECH PRA-------CASSSS -------- ville et specialite');
        praticiens = await db.Praticien.scope(scopePrati).findAll({ where: { valide: true },
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: {
                    [Op.and]: [{ ville: villeRch }, { '$Praticien.id_speCat$': id_speCatRch }]
                }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    } else if (villeRch.length && !id_speCatRch.length) { // rch ville
        console.log('---- SERVICE ADRESSE ECH PRA-------CASSSS --------ville');
        praticiens = await db.Praticien.scope(scopePrati).findAll({ where: { valide: true },
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: { ville: villeRch }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    } else if (!villeRch.length && id_speCatRch.length) { // rch specialite
        console.log('----  SERVICE ADRESSE ECH PRA-------CASSSS --------specialite');
        praticiens = await db.Praticien.scope(scopePrati).findAll({ where: { valide: true },
            include: [{
                model: db.Adresse,
                as: 'Adresse',
                where: { '$Praticien.id_speCat$': id_speCatRch }
            }
                ,
            { model: db.Profil, as: 'Profil' }
            ]
        });
    } else {
        console.log('---- SERVICE ADRESSE ECH PRA-------CASSSS --------AUCUN');
    } 

    if (!praticiens) throw 'Aucun praticien, reformuler recherche';

    const listeSpe = await specialiteService.getAllCache();
    // Recuperation et formatage libelle specialite, transform Image 
    for (var i = 0; i < praticiens.length; i++) {
        const pra = praticiens[i];
        var speTitre = await specialiteService.getByCat(pra.id_speCat);
        var speTitre = listeSpe[pra.id_speCat];
        pra.id_speCat = speTitre;

        const pro = pra.Profil;
        if(pro != null) {
            pro.dataImg = Buffer.from(pro.dataImg).toString('base64');
        }    
    }

    //console.log('----FIN SERVICE ADRESSE--------getPraticienByAdresse params=' + JSON.stringify(praticiens));
    //if (!praticiens) throw 'praticien not found';
    return praticiens;
}

async function update(id, params) {
    console.log('---------DEB SERVICE ADRESSE----------  update id='+id+' params=' + params);
    const adresse = await getAdresse(id);
    // copy params to adresse and save
    Object.assign(adresse, params);
    await adresse.save();
    console.log('---------FIN SERVICE ADRESSE----------  update');
}
async function getById(id) {
    return await getAdresse(id);
}

async function getAll() {
    return await db.Adresse.findAll();
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



async function _delete(id) {
    const adresse = await getAdresse(id);
    await adresse.destroy();
}

async function getAdresse(id) {
    const adresse = await db.Adresse.findByPk(id);
    if (!adresse) throw 'adresse not found';
    return adresse;
}

