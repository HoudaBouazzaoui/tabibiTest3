const mysqlConnection = require('../db/connect');

let cacheProvider = require('../cache-provider');
const CACHE_KEY_SPE = 'CACHE_KEY_SPE';
const CACHE_DURATION = 6000;

module.exports = {
    getAllSpecialiteCache,
    getAllSpecialite,
    getSpecialiteByCat
};

function fctStart (err) {
    console.log('------------------------cacheProvider.start  fctStart');
    if (err){ 
        console.log('ERREUR------------------------cacheProvider.start');
        console.log(err)
    }
}

async function getAllSpecialiteCache() {
    console.log('--------------------getAllSpecialiteCache()');

    cacheProvider.start(fctStart);

    var listSpe = cacheProvider.instance().get(CACHE_KEY_SPE);
    if (listSpe == undefined) {
        console.log('--------------------getAllSpecialiteCache() NO NO NO cacheProvider');
        listSpe = await getAllSpecialite();
        success = cacheProvider.instance().set(CACHE_KEY_SPE, listSpe, CACHE_DURATION);
        if (success) {
            console.log('--------------------getAllSpecialiteCache() mise en cache success=' + success);
        }
    } else {
        console.log('--------------------getAllSpecialiteCache() cache OK , la liste vient du cache');
    }
    return listSpe;
}

async function getAllSpecialite() {
    return new Promise((resolve, reject) => {
        console.log('--------------------service DEBB-------------  getAllSpecialite');
        mysqlConnection.query("SELECT * FROM `praticienSpecialite`", (error, elements) => {
            if (error) {
                return reject(error);
            }
            /*
                      var listeSpecialite = [];
                      Object.keys(elements).forEach(function (key) {
                        var row = elements[key];
                        var spe = {
                          id: row.id_spe,
                          id_speCat: row.id_speCat,
                          specialite: row.specialite,
                          titre: row.titre
                        };
                        listeSpecialite.push(spe);
                      });
            */
            var listeSpecialite = {};
            Object.keys(elements).forEach(function (key) {
                var spe = elements[key];
                listeSpecialite[spe.id_speCat] = spe.titre;
            });

            console.log('--------------------service FIN-------------  getAllSpecialite');
            return resolve(listeSpecialite);
        });
    });
}

async function getSpecialiteByCat(id) {
    const listeSpe = await getAllSpecialiteCache();
    const titre = listeSpe[id];
    return titre;
}

/*
function kawkaw (err) {
    console.log('---------KAWKAW KAW KAW cacheProvider.start');

    if (err){ 
        console.log('---------KAWKAW KAW KAW ERRRRRRRRRRRRRRRRRRRRRRRRRROOOOOOOOO');
        console.log(err)
    }
}

async function getAllSpecialiteCache() {
    console.log('--------------------service DEBB CACHE-------------  getAllSpecialite');

    cacheProvider.start(kawkaw);

    var listSpe = cacheProvider.instance().get(CACHE_KEY_SPE);
    if (listSpe == undefined) {
        console.log('----CACHE---NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        listSpe = await getAllSpecialite();
        success = cacheProvider.instance().set(CACHE_KEY_SPE, listSpe, CACHE_DURATION);
        if (success) {
            console.log('----CACHE---2222 OKKKK success=' + success);
        }
    } else {
        console.log('----CACHE---DEJAAAA !!!!!!!!!!!!!! ');
    }
    return listSpe;
}
*/