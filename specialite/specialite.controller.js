const express = require('express');
const router = express.Router();
//const Joi = require('joi');
//const validateRequest = require('utilisa/_middleware/validate-request');
//const verifyToken = require("utilisa/_middleware/auth");
const verifyToken = require("_middleware/auth");
//const Role = require('utilisa/_helpers/role');
const specialiteService = require('./specialite.service');

//const app = express();

// routes
router.get('/', getAll);
router.get('/cache', getAllCache);
router.get('/:id', getByCat);

module.exports = router;

// route functions

function getAll(req, res, next) {
    console.log('---------------------------------  getAll');
    specialiteService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getAllCache(req, res, next) {
    console.log('---------------------------------  getAll');
    specialiteService.getAllCache()
        .then(users => res.json(users))
        .catch(next);
}

function getByCat(req, res, next) {
    console.log('---------------------------------  getByCat');
    specialiteService.getByCat(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}
