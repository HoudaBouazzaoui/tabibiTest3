const express = require('express');
const router = express.Router();
const verifyToken = require("_middleware/auth");
const horaireService = require('../praticien/horairePraticien.service');
const valForm = require('../_middleware/validate-form');


router.get('/horaire', verifyToken.verifyToken, getByIdPraticien);
router.put('/mod/:id',verifyToken.verifyToken, valForm.horUp, update);// TODO verifyToken
module.exports = router;


function getByIdPraticien(req, res, next) {
    console.log('-----horairePraticien.controller-----getByIdPraticien');
    horaireService.getHorairePraticien(req)
        .then(horairePraticien => res.json(horairePraticien))
        .catch(next);
}

function update(req, res, next) {
    // TODO
    console.log('--GEST---horairePraticien.controller-----update');
    const idHor = req.params.id;
    console.log('---------------------------------  update body=' + JSON.stringify(req.body));

    // on verifie l id praticien avec l id praticien envoye
    if(!idHor){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        horaireService.update(idHor, req.body).then(() => res.json({ message: 'Mis a jour' })).catch(next);
    }
}