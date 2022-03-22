const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('utilisa/_middleware/validate-request');
//const verifyToken = require("utilisa/_middleware/auth");
const verifyToken = require("_middleware/auth");
const Role = require('utilisa/_helpers/role');
const userService = require('./user.service');

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
/*h
var session = require('express-session');
app.use(session({
    secret: 'yoursecret',
    cookie: {
        path: '/',
        domain: 'yourdomain.com',
        maxAge: 1000 * 60 * 24 // 24 hours
    }
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
*/






// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

router.get('/email/:email', getByEmail);

//router.post('/connect', verifyToken.verifyToken, connect);
router.post('/connect', connect);
//router.post('/connect', connect);

module.exports = router;

// route functions

function getAll(req, res, next) {
    console.log('---------------------------------  getAll');
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    console.log('---------------------------------  getById');
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    console.log('---------------------------------  create');
    /*
    userService.create(req.body)
        .then(() => res.json({ message: 'User created' }))
        .catch(next);
    */
    userService.create(req.body)
    .then(user => res.json(user))
    .catch(next);
}

function update(req, res, next) {
    console.log('---------------------------------  update');
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    console.log('---------------------------------  _delete');
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    console.log('---------------------------------  createSchema');
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
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

function getByEmail(req, res, next) {
    console.log('---------------------------------  getByEmail = ' +req.params.email);
    userService.getByEmail(req.params.email)
        .then(user => res.json(user))
        .catch(next);
}

function connect(req, res, next) {
    console.log('---------------------------------  connect controller');
    var message ='';
    //userService.connect(req.body, res).then(user => res.json(user)).catch(next);
    userService.connect(req.body, res);
    /*
    const user =  userService.connect(req.body, message);
    if (message.toString().trim() === 'OK') {
        console.log('---------------------------------  connect controller OK');
        res.json(user);
    }else{
        console.log('---------------------------------  connect controller KO');
        res.status(401).json({ msg: "Invalid credencial" });
    }*/
    console.log('---------------------------------  connect controller FINNN');
}