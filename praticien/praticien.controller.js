const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
//const verifyToken = require("utilisa/_middleware/auth");
const verifyToken = require("_middleware/auth");
const Role = require('utilisa/_helpers/role');
const praticienService = require('./praticien.service');
let consAuth = require("_const/auth");

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

// routes
router.get('/logOut/',verifyToken.verifyToken, logOut);
router.get('/', getAll);// TODO verifyToken
router.get('/:id', getById);// TODO verifyToken
//router.post('/',verifyToken.verifyToken, createSchema, create); // TODO verifyToken
router.post('/', createSchema, create); // TODO verifyToken
router.put('/:id', updateSchema, update);// TODO verifyToken
router.delete('/:id', _delete);// TODO verifyToken
//router.get('/email/:email', getByEmail);
router.post('/connect', connect);



module.exports = router;

// route functions

function getAll(req, res, next) {
    // TODO
    console.log('---------------------------------  getAll');
    praticienService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    // TODO
    console.log('---------------------------------  getById');
    praticienService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    console.log('---------------------------------  create body=' + JSON.stringify(req.body));
    praticienService.create(req.body)
        .then(praticien => res.json(praticien))
        .catch(next);
}

function update(req, res, next) {
    // TODO
    console.log('---------------------------------  update');
    praticienService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    // TODO
    console.log('---------------------------------  _delete');
    praticienService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    console.log('----------------PRATICIEN CONTROLLER-----------------  createSchema');
    const schema = Joi.object({
        id_speCat: Joi.string().required(),
        titre: Joi.string().required(),
        nom: Joi.string().required(),
        prenom: Joi.string().required(),
        dateNaissance: Joi.string().required(),
        email: Joi.string().email().required(),
        telephone: Joi.string().min(10).required(),
        fax: Joi.string().min(10).required(),
        motpasse: Joi.string().min(6).required(),
        motpasseConfirme: Joi.string().valid(Joi.ref('motpasse')).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    console.log('---------------------------------  updateSchema');
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

function connect(req, res, next) {
    console.log('------------------DEB---------------praticien.controller  connect ');
    var message = '';
    //praticienService.connect(req.body, res).then(user => res.json(user)).catch(next);
    praticienService.connect(req.body, res).catch(next);
    console.log('------------------FIN---------------praticien.controller  connect ');
}

function logOut(req, res, next) {
    console.log('------------------DEB---------------praticien.controller  logOut ');
    try {
        //let accessToken = req.cookies.jwt
        const token = req.headers.cookie;
        var accessToken = token.split('jwt=')[1];
        console.log('-------accessToken = ' + accessToken);
        if (!accessToken) {
            console.log('-------NOOOOOO token = ');
            return res.status(401).json({ msg: 'NO TOKEN' });
        }
    }
    catch (e) {
        console.log('----ERRRR---jwt.verify' + e);
        return res.status(401).json({
            msg: e
        });
    }

    const jwt = require("jsonwebtoken");
    var payload = req.payload;

    res.cookie(consAuth.ACCESS_TOKEN_NOM, 'tzzzzzzzz', { secure: true, httpOnly: true })
    // TODO erreur lors de la maj du expiresIn
    try {
        let accessToken1 = jwt.sign(payload, consAuth.ACCESS_TOKEN_SECRET, {
            algorithm: consAuth.ALGORITHM,
            expiresIn: 1
        })
        console.log('------------------FIN---------------praticien.controller  logOut ==' + accessToken1);

    }
    catch (e) {
        console.log('----ERRRR---praticien.controller  logOut' + e);
        return res.status(401).json({
            msg: 'errueur logout'
        });
    }
}

/*
function getByEmail(req, res, next) {
    console.log('---------------------------------  getByEmail = ' +req.params.email);
    praticienService.getByEmail(req.params.email)
        .then(user => res.json(user))
        .catch(next);
}


*/