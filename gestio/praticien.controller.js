const express = require('express');
const router = express.Router();
const verifyToken = require("_middleware/auth");
const valForm = require('../_middleware/validate-form');
const praticienService = require('../praticien/praticien.service');


router.post('/cr', valForm.praCre, valForm.adrCre, valForm.horCre, create); // TODO verifyToken
//router.post('/cr', valForm.praCre, create); // TODO verifyToken
router.put('/mod/:id',verifyToken.verifyToken, valForm.praUp, update);// TODO verifyToken

module.exports = router;


function create(req, res, next) {
    const creerPar = require("_const/creerPar");
    var pra = req.body;
    pra.cr = creerPar.Gestio;
    console.log('---------------------------------  create body=' + JSON.stringify(req.body));
    praticienService.create(req.body).then(praticien => res.json(praticien)).catch(next);
}

function update(req, res, next) {
    const idPra = req.params.id;
    // TODO
    console.log('---------------------------------  update body=' + JSON.stringify(req.body));
    // on verifie l id praticien avec l id praticien envoye
    if(!idPra){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        praticienService.update(idPra, req.body, true).then(() => res.json({ message: 'Mis a jour' })).catch(next);
    }
}


function _delete(req, res, next) {
    // TODO
    console.log('---------------------------------  _delete');
    praticienService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}
