const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const verifyToken = require("_middleware/auth");
const Role = require('./role');
const gestioService = require('./gestio.service');
let consAuth = require("_const/auth");
const praticienService = require('../../praticien/praticien.service');

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());

// routes
router.get('/esp', chargement);
router.get('/charg/:id',verifyToken.verifyToken, charg);

router.post('/aVal',verifyToken.verifyToken , getListePraticienAValider);
router.put('/valid/:id',verifyToken.verifyToken , validerPraticien);
router.get('/pra/:id',verifyToken.verifyToken , getPraticien);


router.post('/nv', createSchema, create); // TODO verifyToken
router.put('/mod/:id',verifyToken.verifyToken, updateSchema, update);// TODO verifyToken
router.post('/connect', connect);
router.get('/pra/',verifyToken.verifyToken, getPraticienConnect);
router.get('/logOut/',verifyToken.verifyToken, logOut);

router.get('/', getAll);// TODO verifyToken
//router.get('/:id', getById);// TODO verifyToken
//router.post('/',verifyToken.verifyToken, createSchema, create); // TODO verifyToke
//router.post('/mod/:id',verifyToken.verifyToken, updateSchema, update);// TODO verifyToken
//router.delete('/:id', _delete);// TODO verifyToken
//router.get('/email/:email', getByEmail);

module.exports = router;

// todo methode pur charger un html
function chargement(req, res, next) {
    console.log('------------------DEB--------chargement __dirname=' + __dirname);
    var message = '';

    const path = require("path");
    // TODO
    //let indexPath = path.join(__dirname, "../../public/bog/hw.html");
    let indexPath = path.join(__dirname, "../../pub/bog/coGestio.html");

    res.sendFile(indexPath);
    //res.render(indexPath, {name:"kawiiiiiiii kaw"});
    console.log('------------------FIN---------------chargement __dirname');
}

function charg(req, res, next) {
    const fileName = req.params.id;
    console.log('------------------DEB--------chargement __dirname=' + __dirname);
    console.log('------------------1--------chargement fileName=' + fileName);
    const path = require("path");
    //let indexPath = path.join(__dirname, "../../public/bog/vPra.html");
    //const chemin = "../../pub/bog/" + fileName + ".html" ;
    const chemin = "../../pub/bog/" + fileName + ".html" ;
    console.log('************---chargement chemin=' + chemin);
    let indexPath = path.join(__dirname, chemin);
    res.sendFile(indexPath);
    console.log('------------------FIN---------------chargement __dirname');
}

async function getListePraticienAValider(req, res, next) {
    console.log('-----gesyio.controller-----getListePraticienAValider');
    var criterRch = req.body;
    console.log('-----req.criterRch=' + JSON.stringify(criterRch));

    praticienService.getAllCompleteNonValide().then(praticiens => res.json(praticiens)).catch(next);
}

async function getPraticien(req, res, next) {
    const idPra = req.params.id;
    console.log('-----gesyio.controller-----getPraticien idPra=' + idPra);
    praticienService.getByIdComplet(idPra).then(pra => res.json(pra)).catch(next);
}


function validerPraticien(req, res, next) {
    // TODO
    console.log('----DEB  -gesyio.controller-----getListePraticienAValider');
    const idPrati = req.params.id;
    console.log('-----gesyio.controller-----getListePraticienAValider idPrati=' + idPrati);
    // on verifie l id praticien avec l id praticien envoye
    if(!idPrati){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        praticienService.validerPraticien(idPrati).then(() => res.json({ message: 'Prati Valid' })).catch(next);
    }
}

function create(req, res, next) {
    console.log('------------------GSTIO CONTROLLER------------  create body=' + JSON.stringify(req.body));
    gestioService.create(req.body).then(gestio => res.json(gestio)).catch(next);
}

function createSchema(req, res, next) {
    console.log('----------------GSTIO CONTROLLER-----------------  createSchema');
    const schema = Joi.object({
        titre: Joi.string().required(),
        nom: Joi.string().required(),
        prenom: Joi.string().required(),
        dateNaissance: Joi.string().required(),
        //role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        motpasse: Joi.string().min(6).required(),
        motpasseConfirme: Joi.string().valid(Joi.ref('motpasse')).required()
    });
    validateRequest(req, next, schema);
}

function connect(req, res, next) {
    console.log('------------------DEB---------------gestio.controller  connect ');
    gestioService.connect(req.body, res).catch(next);
    //gestioService.connect(req.body, res).then(gestio => res.sendFile(indexPath)).catch(next);
    console.log('------------------FIN---------------gestio.controller  connect ');
}



function update(req, res, next) {
    // TODO
    console.log('---------------------------------  update body=' + JSON.stringify(req.body));
    // on verifie l id praticien avec l id praticien envoye
    if(req.payload.praticien.id != req.params.id){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        gestioService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Mis a jour' }))
        .catch(next);
    }
}

function getPraticienConnect(req, res, next) {
    console.log('---------------------------------  getPraticienConnect');
    const id = req.payload.praticien.id;
    gestioService.getByIdComplet(id).then(pra => res.json(pra)).catch(next);
}

function getAll(req, res, next) {
    // TODO
    console.log('---------------------------------  getAll');
    gestioService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    // TODO
    console.log('---------------------------------  getById');
    gestioService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    // TODO
    console.log('---------------------------------  _delete');
    gestioService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions



function updateSchema(req, res, next) {
    console.log('---------------------------------  updateSchema');
    const schema = Joi.object({
        id_speCat: Joi.string().empty(''),
        titre: Joi.string().empty(''),
        //titre: Joi.string().valid(Role.Admin, Role.User).empty(''),
        nom: Joi.string().empty(''),
        prenom: Joi.string().empty(''),
        nom: Joi.string().empty(''),
        dateNaissance: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        telephone: Joi.string().min(10).empty(''),
        fax: Joi.string().min(10).empty(''),
        nom: Joi.string().empty(''),
        nom: Joi.string().empty(''),
        nom: Joi.string().empty(''),
        motpasse: Joi.string().min(6).empty(''),
        motpasseConfirme: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
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

    res.cookie(consAuth.ACCESS_TOKEN_NOM, 'na3na3', { secure: true, httpOnly: true })
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