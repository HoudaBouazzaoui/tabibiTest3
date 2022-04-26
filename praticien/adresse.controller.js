const express = require('express');
const router = express.Router();
const adresseService = require('./adresse.service');

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

// routes
router.post('/rchAdresse', getListePraticienByAdresse);
module.exports = router;

// route functions


async function getListePraticienByAdresse(req, res, next) {

    console.log('-----adresse.controller-----getPraticienByAdresse');
    var criterRch = req.body;
    console.log('-----req.criterRch=' + JSON.stringify(criterRch));
    adresseService.getListePraticienByAdresse(criterRch).then(praticiens => res.json(praticiens)).catch(next);
/*
    const praticiens = await adresseService.getListePraticienByAdresse(criterRch);

    req.praticiens = praticiens;
    req.body.criterRch = praticiens;

    res.redirect('/rdvs/rdvlib1');
    */
    //http://localhost:4000/rdvs/rdvlib1
}
