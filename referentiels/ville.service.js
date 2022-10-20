const db = require('db/dbMysql2');

let cacheProvider = require('../cache-provider');
const CACHE_KEY_VILLES = 'CACHE_KEY_VILLES_VILLES';
const CACHE_DURATION = 6000;

module.exports = {
    getAllVille
    ,getVilleById
    ,getAllVilleCache
};

async function getAllVille() {
    console.log('-----ville.service-----getAllVille');
    return await db.Ville.findAll();
}

async function getVilleById(id) {
    console.log('-----ville.service-----getVilleById id=' + id);
    const ville = await db.Ville.findByPk(id);
    if (!ville) throw 'Ville nexiste pas en BD';
    return ville;
}

function fctStart (err) {
    console.log('------------------------cacheProvider.start  fctStart');
    if (err){ 
        console.log('ERREUR------------------------cacheProvider.start');
        console.log(err)
    }
}

async function getAllVilleCache() {
    console.log('--------------------getAllVilleCache()');

    cacheProvider.start(fctStart);

    var listVille = cacheProvider.instance().get(CACHE_KEY_VILLES);
    if (listVille == undefined) {
        console.log('--------------------getAllVilleCache() NO NO NO cacheProvider');
        listVille = await getAllVille();
        success = cacheProvider.instance().set(CACHE_KEY_VILLES, listVille, CACHE_DURATION);
        if (success) {
            console.log('--------------------getAllVilleCache() mise en cache success=' + success);
        }
    } else {
        console.log('--------------------getAllVilleCache() cache OK , la liste vient du cache');
    }
    return listVille;
}