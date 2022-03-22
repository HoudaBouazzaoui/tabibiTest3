const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const verifyToken = require("_middleware/auth");
const Role = require('utilisa/_helpers/role');
const horaireService = require('./horairePraticien.service');

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

// routes
router.get('/horaire', verifyToken.verifyToken, getByIdPraticien);
module.exports = router;

// route functions


function getByIdPraticien(req, res, next) {
    console.log('-----horairePraticien.controller-----getByIdPraticien');
    horaireService.getHorairePraticien(req)
        .then(horairePraticien => res.json(horairePraticien))
        .catch(next);
}
