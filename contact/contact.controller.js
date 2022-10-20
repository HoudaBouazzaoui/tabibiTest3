const express = require("express");
const router = express.Router();



router.post("/message", envoyerMessage);
module.exports = router;

function envoyerMessage(req, res, next) {
    console.log('-----contact.controller-----envoyerMessage');

    var message = req.body;
    console.log('-----req.message=' + JSON.stringify(message));
/*
    const praticien = req.payload.praticien;
    const horairePraticienId = praticien.HorairePraticienId;
    horaireService.getHorairePraticien(horairePraticienId).then(horairePraticien => res.json(horairePraticien))
        .catch(next);
        */
}
