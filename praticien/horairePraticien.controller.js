const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequestParent = require('_middleware/validate-request');
const validateRequest = validateRequestParent.validateRequest;
const validateRequestSous = validateRequestParent.validateRequestSous;

const verifyToken = require("_middleware/auth");
const horaireService = require('./horairePraticien.service');
const valForm = require('../_middleware/validate-form');

/*
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
*/


router.get('/horaire', verifyToken.verifyToken, getByIdPraticien);
router.put('/mod/:id',verifyToken.verifyToken, valForm.horUp, update);// TODO verifyToken
module.exports = router;

// route functions


function getByIdPraticien(req, res, next) {
    console.log('-----horairePraticien.controller-----getByIdPraticien');
    const praticien = req.payload.praticien;
    const horairePraticienId = praticien.HorairePraticienId;
    horaireService.getHorairePraticien(horairePraticienId)
        .then(horairePraticien => res.json(horairePraticien))
        .catch(next);
}

function update(req, res, next) {
    // TODO
    console.log('-----horairePraticien.controller-----update');
    const idHor = req.payload.praticien.HorairePraticienId;
    console.log('----------  idHoridHoridHoridHoridHor=' + idHor);
    console.log('---------------------------------  update body=' + JSON.stringify(req.body));

    console.log('----------  req.payload.praticien.id=' + req.payload.praticien.id);
    console.log('----------  req.params.id=' + req.params.id);
    // on verifie l id praticien avec l id praticien envoye
    if(req.payload.praticien.id != req.params.id){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        horaireService.update(idHor, req.body)
        .then(() => res.json({ message: 'Mis a jour' }))
        .catch(next);
    }
}
