const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const verifyToken = require("_middleware/auth");
const patientService = require('./patient.service');

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

// routes
router.get('/rchPat/:nom', verifyToken.verifyToken, rechercherPatientsDePraticien);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
//router.get('/email/:email', getByEmail);
//router.post('/connect', connect);


module.exports = router;

// route functions

function rechercherPatientsDePraticien(req, res, next) {
    // TODO
    console.log('-----------------patient.controller----------------  rechercherPatient');
    patientService.rechercherPatientsDePraticien(req)
        .then(patients => res.json(patients))
        .catch(next);
}


function getAll(req, res, next) {
    // TODO
    console.log('---------------------------------  getAll');
    patientService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    // TODO
    console.log('-----------------patient.controller----------------  getById');
    patientService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    console.log('------------------patient.controller---------------  create body=' + JSON.stringify(req.body));
    patientService.create(req.body)
    .then(praticien => res.json(praticien))
    .catch(next);
}

function update(req, res, next) {
    // TODO
    console.log('---------------patient.controller------------------  update');
    patientService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    // TODO
    console.log('--------------------patient.controller-------------  _delete');
    patientService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    console.log('----------------patient.controller-----------------  createSchema');
    const schema = Joi.object({
        titre: Joi.string().required(),
        nom: Joi.string().required(),
        prenom: Joi.string().required(),
        dateNaissance: Joi.string().required(),
        email: Joi.string().email().required(),
        telephone: Joi.string().min(10).required(),
        motpasse: Joi.string().min(6).required(),
        motpasseConfirme: Joi.string().valid(Joi.ref('motpasse')).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    // TODO
    console.log('------------------patient.controller---------------  updateSchema');
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        phoneNumber: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

/*
function getByEmail(req, res, next) {
    console.log('---------------------------------  getByEmail = ' +req.params.email);
    patientService.getByEmail(req.params.email)
        .then(user => res.json(user))
        .catch(next);
}

function connect(req, res, next) {
    console.log('---------------------------------  connect controller');
    var message ='';
    //patientService.connect(req.body, res).then(user => res.json(user)).catch(next);
    patientService.connect(req.body, res);
    console.log('---------------------------------  connect controller FINNN');
}
*/