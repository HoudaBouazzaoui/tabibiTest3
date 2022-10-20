const express = require('express');
const router = express.Router();
const villeService = require('./ville.service');


router.get('/', getAllVille);
router.get('/cache', getAllVilleCache);
router.get('/:id', getVilleById);

module.exports = router;

function getAllVille(req, res, next) {
    console.log('---------------------------------  getAllVille');
    villeService.getAllVille().then(villes => res.json(villes)).catch(next);
}

function getAllVilleCache(req, res, next) {
    console.log('---------------------------------  getAllVilleCache');
    villeService.getAllVilleCache().then(villes => res.json(villes)).catch(next);
}

function getVilleById(req, res, next) {
    console.log('---------------------------------  getVilleById');
    villeService.getVilleById(req.params.id).then(ville => res.json(ville)).catch(next);
}