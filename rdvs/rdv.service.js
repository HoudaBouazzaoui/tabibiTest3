const mysqlConnection = require('../db/connect');
const db = require('db/dbMysql2');
const Sequelize = require("sequelize");


async function getListeRdvsPraticien(req) {
  return new Promise((resolve, reject) => {
    console.log('--------------------rdv.service DEBB-------------  getListeRdvsPrati');
    console.log('--------------------rdv.service DEBB-------------  req.payload=' + JSON.stringify(req.payload));
    var praticien = req.payload.praticien;
    console.log('--------------------rdv.service DEBB-------------  praticien.id=' + praticien.id);
    let idPraticien = praticien.id;
    const rdvs = db.Rdv.findAll({ raw: true, where: { id_pra: idPraticien } });
    console.log('--------------------rdv.service FIN-------------  getListeRdvsPraticien');
    return resolve(rdvs);
  });
}

async function getListeRdvsLibre(req) {

  const praticienService = require('praticien/praticien.service');
  const listePraticiens = await praticienService.getAll();

  console.log('**---DEB---rdv.service -------------  getListeRdvsLibre');

  var listEvent = [];
  listePraticiens.forEach(praticien => {
      console.log('***----forEach------------  praticien.id=' + praticien.id);
      const idPraticien = praticien.id;

      
      var rdvs = [];
      (async function() {
        rdvs = await getListeRdvsLibre1(req, idPraticien);
        console.log(JSON.stringify(rdvs));
    })();

      //var events =  transformRdvsLIBREToEvents(rdvs, req, idPraticien);
      listEvent.push(rdvs);

    });

    console.log('**---FIN---rdv.service -------------  getListeRdvsLibre====' + JSON.stringify(listEvent));
    return listEvent;
}

async function getListeRdvsLibre1(req, idPraticien) {
/*
  const praticienService = require('praticien/praticien.service');
  const listePraticiens = await praticienService.getAll();
*/
  console.log('**------rdv.service DEBB-------------  getListeRdvsLibre');
/*
  return new Promise((resolve, reject) => {
    */
    /*
    console.log('**------rdv.service -------------  req.payload=' + JSON.stringify(req.payload));
    var praticien = req.payload.praticien; // TODO
    console.log('***-----rdv.service -------------  praticien.id=' + praticien.id);
    let idPraticien = praticien.id;
    */

    /*
    const Op = Sequelize.Op;
    let date_ob = new Date();
    const rdvs = db.Rdv.findAll({
      raw: true, where: {
        //[Op.and]: [{ id_pra: {[Op.in]: idsPraticient} }, { dateDebut: { [Op.gt]: date_ob } }]
        [Op.and]: [{ id_pra: idPraticien }, { dateDebut: { [Op.gt]: date_ob } }]
      }
      , order: [['dateDebut', 'ASC']]
    });
    console.log('--------------------rdv.service FIN-------------  getListeRdvsLibre');
    return resolve(rdvs);
  });
*/
  const Op = Sequelize.Op;
    let date_ob = new Date();
  return await db.Rdv.findAll({
    raw: true, where: {
      //[Op.and]: [{ id_pra: {[Op.in]: idsPraticient} }, { dateDebut: { [Op.gt]: date_ob } }]
      [Op.and]: [{ id_pra: idPraticien }, { dateDebut: { [Op.gt]: date_ob } }]
    }
    , order: [['dateDebut', 'ASC']]
  });
}


async function getListeRdvsPatientLibre(req) {
  return new Promise((resolve, reject) => {
    console.log('--------------------rdv.service DEBB-------------  getListeRdvsPatientLibre');
    console.log('--------------------rdv.service DEBB-------------  req.payload=' + JSON.stringify(req.payload));
    var praticien = req.payload.praticien; // TODO
    console.log('--------------------rdv.service DEBB-------------  praticien.id=' + praticien.id);
    let idPraticien = praticien.id;
    const Op = Sequelize.Op;
    let date_ob = new Date();
    const rdvs = db.Rdv.findAll({
      raw: true, where: {
        [Op.and]: [{ id_pra: idPraticien }, { dateDebut: { [Op.gt]: date_ob } }]
      }
      , order: [['dateDebut', 'ASC']]
    });
    console.log('--------------------rdv.service FIN-------------  getListeRdvsPatientLibre');
    return resolve(rdvs);
  });
}

async function creerRdvETPatien(req) {
  var params = req.body;
  var praticien = req.payload.praticien;
  let idPraticien = praticien.id;
  // TODO peut etre mettre une transaction afin errors to rollback car 2 creation adresse et Patient
  console.log('------------------DEB SERVICE creerRdvETPatien---------------  create params=' + params);
  // la verfification d email si existe et le hash du mot de passe n est pas faite 
  // car creation depuis lespace praticien 
  const patient = new db.Patient(params);
  patient.PraticienId = idPraticien;
  await patient.save();
  let idPatient = patient.id;
  console.log('--------------------SERVICE creerRdvETPatien 555-------------  patient=' + JSON.stringify(patient));
  const rdv = new db.Rdv(params);
  console.log('--------------------SERVICE creerRdvETPatien 555-------------  rdv=' + JSON.stringify(rdv));

  console.log('-------req.body.dateRdvDebut  =' + req.body.dateRdvDebut);
  console.log('-------req.body.dateRDVFin    =' + req.body.dateRDVFin);

  rdv.id_pra = idPraticien;
  rdv.id_pat = idPatient;
  rdv.motif = req.body.motif;
  rdv.dateDebut = req.body.dateRdvDebut;
  rdv.dateFin = req.body.dateRDVFin;

  console.log('--------------------SERVICE creerRdvETPatien 666-------------  rdv=' + JSON.stringify(rdv));
  await rdv.save();
  console.log('--------------------SERVICE creerRdvETPatien 777-------------  rdv=' + JSON.stringify(rdv));

  console.log('------------------FIN creerRdvETPatien Patient---------------  create');
  return patient;
  /*
      var rdvData = {
          ID_PAT : idPatient,
          ID_PRA : idPraticien,
          MOTIF : req.body.motif,
          DATERDVDEB : req.body.dateRdvDebut,
          DATERDVFIN : req.body.dateRDVFin 
      };
      creerRdv(rdvData);
      */
}

async function suprimerRdv(id) {
  const rdv = await getRdvById(id);
  await rdv.destroy();
}

async function getRdvById(id) {
  const rdv = await db.Rdv.findByPk(id);
  if (!rdv) throw 'Le rdv n existe pas pour l id =' + id;
  return rdv;
}


module.exports = {
  getListeRdvsPraticien,
  getListeRdvsLibre1,
  getListeRdvsPatientLibre,
  creerRdvETPatien,

  suprimerRdv
/*
  getListeRdvById,
  getListeRdvs,
  creerPatien,
  creerRdv
*/
}










function creerPatien(patien) {
  var idPatien = 0;
  mysqlConnection.query('INSERT INTO patien SET?', patien, (err, res) => {
    if (err) {
      throw err;
    }
    idPatien = res.insertId;
    console.log('DANS ID insertion patien :', idPatien);

  });
  console.log('FIN ID insertion patien :', idPatien);
  return idPatien;
}

function creerRdv(rdv) {
  mysqlConnection.query('INSERT INTO rdv SET?', rdv, (err, res) => {
    if (err) {
      throw err;
    }
    console.log('ID insertion rdv :', res.insertId);
  });
}

function getListeRdvById(idRdv, res) {
  mysqlConnection.query(
    'SELECT * FROM `rdv` as r LEFT JOIN patien as p on r.ID_PAT = p.ID_PAT where r.ID_RDV = ' + idRdv, function (err, result) {
      if (err) {
        console.error(err);
        throw err;
      }
      //console.log('resuuu :', result);
      var events = [];
      Object.keys(result).forEach(function (key) {
        var row = result[key];
        var ev = {
          id: row.ID_RDV,
          title: row.MOTIF,
          start: row.DATERDVDEB.toISOString(),
          end: row.DATERDVFIN !== null ? row.DATERDVFIN.toISOString() : ""
        };
        events.push(ev);

      });

      res.send(events);
    });;
}

async function transformRdvsToEvents(rdvs) {
  var listeEvents = [];
  for (rdv of rdvs) {
    var ev = {
      id: rdv.id,
      title: rdv.motif,
      start: row.dateDebut,
      end: row.dateFin
    };
    listeEvents.push(ev);
  }
  return listeEvents;
}

async function getListeRdvs1(res) {
  console.log('--------------------service DEBB-------------  getListeRdvs');
  var rdvs = [];
  await mysqlConnection.query("SELECT * FROM `rdv`", function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    //console.log(result);	
    var listeRdvs = [];

    Object.keys(result).forEach(function (key) {
      var row = result[key];

      var ev = {
        id: row.ID_RDV,
        title: row.MOTIF,
        start: row.DATERDVDEB.toISOString(),
        end: row.DATERDVFIN !== null ? row.DATERDVFIN.toISOString() : ""
      };
      rdvs.push(ev);

    });
    //result = events;
    //console.log(events);
    //res.send(JSON.stringify(result));

    //return listeRdvs;
    //res.send(events);
    res.json(rdvs);
  });;

  console.log('--------------------service FINN-------------  getListeRdvs');

  console.log(rdvs);
  return rdvs;

  var query = "SELECT * FROM `rdv`";
  var handle = mysqlConnection.querySync(query);
  var results = handle.fetchAllSync();

  Object.keys(result).forEach(function (key) {
    var row = result[key];

    var ev = {
      id: row.ID_RDV,
      title: row.MOTIF,
      start: row.DATERDVDEB.toISOString(),
      end: row.DATERDVFIN !== null ? row.DATERDVFIN.toISOString() : ""
    };
    rdvs.push(ev);

  });
  console.log(JSON.stringify(results));
}


//module.exports = { getListRdvs };
//module.exports = { creerPatien };


/*
const Router = express.Router();
Router.get("/", (req, res) => {
mysqlConnection.query(
  "SELECT * FROM `rdv`",
  (err, results, fields) => {
    if (!err) {
      res.send(results);
    } else {
      console.log(err);
    }
  }
);
});
*/

/*
var mysqlConnection = require('mysql');
var con = mysqlConnection.createConnection({
  host: "localhost",
  user: "root",
  database : "tabibi"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected! ok");
  
     con.query("SELECT * FROM `rdv`", function (err, result) {
       if (err) throw err;
       console.log(result);
     });
});
*/

async function getListeRdvs(req) {

  return new Promise((resolve, reject) => {
    console.log('--------------------rdv.service DEBB-------------  getListeRdvs');
    console.log('--------------------rdv.service DEBB-------------  req.payload=' + JSON.stringify(req.payload));
    var praticien = req.payload.praticien;
    console.log('--------------------rdv.service DEBB-------------  praticien.id=' + praticien.id);
    let idPraticien = praticien.id;
    mysqlConnection.query("SELECT * FROM `rdv` where ID_PRA =" + idPraticien, (error, elements) => {
      if (error) {
        return reject(error);
      }
      var listeRdvs = [];
      Object.keys(elements).forEach(function (key) {
        var row = elements[key];

        var ev = {
          id: row.ID_RDV,
          title: row.MOTIF,
          start: row.DATERDVDEB.toISOString(),
          end: row.DATERDVFIN !== null ? row.DATERDVFIN.toISOString() : ""
        };
        listeRdvs.push(ev);
      });
      console.log('--------------------rdv.service FIN-------------  getListeRdvs');
      return resolve(listeRdvs);
    });
  });

  /*		
  ID_RDV: 1,
  ID_PAT: 1,
  ID_PRA: 1,
  MOTIF: 'COSU',
  DATERDVDEB: 2022-01-05T12:16:54.000Z,
  DATERDVFIN: 2022-01-05T12:16:54.000Z,
  HEURERDV: 2022-01-05T12:16:54.000Z,
  DUREERDV: 'TODO',
  DATEMODIF: 'TODO'
  */


}


