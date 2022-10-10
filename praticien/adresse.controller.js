const express = require('express');
const router = express.Router();
const adresseService = require('./adresse.service');
const verifyToken = require("_middleware/auth");
const valForm = require('../_middleware/validate-form');
let cst = require("_const/cst");

//const Joi = require('joi');
//const validateRequest = require('_middleware/validate-request');

/*
var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
*/

// routes
router.post('/rchAdresse', getListePraticienByAdresse);
router.put('/mod/:id',verifyToken.verifyToken, valForm.adrUp, update);// TODO verifyToken
module.exports = router;


async function getListePraticienByAdresse(req, res, next) {

    console.log('-----\praticien\adresse.controller -----getPraticienByAdresse');
    var criterRch = req.body;
    console.log('-----req.criterRch=' + JSON.stringify(criterRch));
    adresseService.getListePraticienByAdresse(criterRch, cst.user.Pa).then(praticiens => res.json(praticiens)).catch(next);
/*
    const praticiens = await adresseService.getListePraticienByAdresse(criterRch);

    req.praticiens = praticiens;
    req.body.criterRch = praticiens;

    res.redirect('/rdvs/rdvlib1');
    */
    //http://localhost:4000/rdvs/rdvlib1
}

function update(req, res, next) {
    // TODO
    console.log('-----adresse.controller-----update');
    const idAdr = req.payload.praticien.AdresseId;
    console.log('----------  idAdridAdridAdridAdr=' + idAdr);
    console.log('---------------------------------  update body=' + JSON.stringify(req.body));

    console.log('----------  req.payload.praticien.id=' + req.payload.praticien.id);
    console.log('----------  req.params.id=' + req.params.id);
    // on verifie l id praticien avec l id praticien envoye
    if(req.payload.praticien.id != req.params.id){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        adresseService.update(idAdr, req.body)
        .then(() => res.json({ message: 'Mis a jour' }))
        .catch(next);
    }
}

/*
function updateSchema(req, res, next) {
    console.log('---------------------------------  updateSchema');
    const schema = Joi.object({
        numero: Joi.string().required(),
        voie: Joi.string().required(),
        codePostale: Joi.string().required(),
        ville: Joi.string().required()
    });
    validateRequest(req, next, schema);
}
*/