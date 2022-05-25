const mysqlConnection = require('../db/connect');

let cacheProvider = require('../cache-provider');
const CACHE_KEY = 'CACHE_KEY';
const CACHE_DURATION = 6000;

module.exports = {
    getAllCache,
    getAll,
    getByCat
};

function kawkaw (err) {
    console.log('---------KAWKAW KAW KAW cacheProvider.start');

    if (err){ 
        console.log('---------KAWKAW KAW KAW ERRRRRRRRRRRRRRRRRRRRRRRRRROOOOOOOOO');
        console.log(err)
    }
}

async function getAllCache() {
    console.log('--------------------service DEBB CACHE-------------  getListeSpecialite');
    /*
    cacheProvider.start(function (err) {
        console.log('---------KAWKAW KAW KAW cacheProvider.start');
        if (err) console.log(err)
    })
*/

cacheProvider.start(kawkaw);

    var listSpe = cacheProvider.instance().get(CACHE_KEY);
    if (listSpe == undefined) {
        console.log('----CACHE---NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        listSpe = await getListeSpecialite();
        success = cacheProvider.instance().set(CACHE_KEY, listSpe, CACHE_DURATION);
        if (success) {
            console.log('----CACHE---2222 OKKKK success=' + success);
        }
    } else {
        console.log('----CACHE---DEJAAAA !!!!!!!!!!!!!! ');
    }
    return listSpe;
}

async function getAll() {
    return await getListeSpecialite();
}

async function getByCat(id) {
    return await getSpecialiteByCat(id);
}

async function getListeSpecialite() {
    return new Promise((resolve, reject) => {
        console.log('--------------------service DEBB-------------  getListeSpecialite');
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

            console.log('--------------------service FIN-------------  getListeSpecialite');
            return resolve(listeSpecialite);
        });
    });
}

async function getSpecialiteByCat(id) {
    const listeSpe = await getAllCache();
    const titre = listeSpe[id];
    return titre;
}
