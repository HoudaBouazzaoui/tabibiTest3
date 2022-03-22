const mysqlConnection = require('../db/connect');

module.exports = {
    getAll,
    getByCat
};

async function getAll() {
    return await getListeSpecialite();
}

async function getByCat(id) {
    return await getSpecialite(id);
}

async function getSpecialite(id) {
    /*
    const praticien = await db.Praticien.findByPk(id);
    if (!praticien) throw 'praticien not found';
    return praticien;
    */
   return;
}

async function getListeSpecialite() {
    return new Promise((resolve, reject)=>{
      console.log('--------------------service DEBB-------------  getListeSpecialite');
      mysqlConnection.query("SELECT * FROM `praticienSpecialite`",  (error, elements)=>{
          if(error){
              return reject(error);
          }
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
          console.log('--------------------service FIN-------------  getListeSpecialite');
          return resolve(listeSpecialite);
      });
  });
}
