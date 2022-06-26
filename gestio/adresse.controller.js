const express = require('express');
const router = express.Router();
const adresseService = require('../praticien/adresse.service');
const verifyToken = require("_middleware/auth");
const valForm = require('../_middleware/validate-form');


// routes
router.post('/rchAdresse', getListePraticienByAdresse);
router.put('/mod/:id',verifyToken.verifyToken, valForm.adrUp, update);// TODO verifyToken
module.exports = router;


async function getListePraticienByAdresse(req, res, next) {

    console.log('-----adresse.controller-----getPraticienByAdresse');
    var criterRch = req.body;
    console.log('-----req.criterRch=' + JSON.stringify(criterRch));
    adresseService.getListePraticienByAdresse(criterRch).then(praticiens => res.json(praticiens)).catch(next);
}

function update(req, res, next) {
    // TODO
    console.log('---GEST--adresse.controller-----update');
    //const idAdr = req.payload.praticien.AdresseId;
    const idAdr = req.params.id;
    
    console.log('---GEST-------  idAdridAdridAdridAdr=' + idAdr);
    console.log('----GEST-----------------------------  update body=' + JSON.stringify(req.body));
    // on verifie l id praticien avec l id praticien envoye
    if(!idAdr){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        adresseService.update(idAdr, req.body).then(() => res.json({ message: 'Mis a jour' })).catch(next);
    }
}
