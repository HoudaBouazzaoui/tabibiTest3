const express = require('express');
const router = express.Router();
const specialiteService = require('./specialite.service');


router.get('/', getAllSpecialite);
router.get('/cache', getAllSpecialiteCache);
router.get('/:id', getSpecialiteByCat);

module.exports = router;

function getAllSpecialite(req, res, next) {
    console.log('----------------specialite.controller-----------------  getAll');
    specialiteService.getAllSpecialite().then(spes => res.json(spes)).catch(next);
}

function getAllSpecialiteCache(req, res, next) {
    console.log('------------------specialite.controller---------------  getAll');
    specialiteService.getAllSpecialiteCache().then(spes => res.json(spes)).catch(next);
}

function getSpecialiteByCat(req, res, next) {
    console.log('-----------------specialite.controller----------------  getByCat');
    specialiteService.getSpecialiteByCat(req.params.id).then(spesLibelle => res.json(spesLibelle)).catch(next);
}