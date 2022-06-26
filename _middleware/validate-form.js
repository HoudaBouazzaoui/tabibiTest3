const Joi = require('joi');
const validateRequestParent = require('_middleware/validate-request');
const validateRequest = validateRequestParent.validateRequest;
const validateRequestSous = validateRequestParent.validateRequestSous;

const Role = require('utilisa/_helpers/role');

module.exports = {
    praCre
    ,praUp
    ,adrUp
    ,horUp
    ,adrCre
    ,horCre
};

function praCre(req, res, next) {
    console.log('---------------------------------  praCre');
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

function praUp(req, res, next) {
    console.log('---------------------------------  praUp');
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


function adrUp(req, res, next) {
    console.log('---------------------------------  adrUp');
    const schema = Joi.object({
        numero: Joi.string().required(),
        voie: Joi.string().required(),
        codePostale: Joi.string().required(),
        ville: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function horUp(req, res, next) {
    console.log('---------------------------------  horUp');
    const schema = Joi.object({
        matinDebut: Joi.string().required(),
        matinFin: Joi.string().empty(''),
        soirDebut: Joi.string().empty(''),
        soirFin: Joi.string().required(),

        lun: Joi.string().required(),
        mar: Joi.string().required(),
        mer: Joi.string().required(),
        jeu: Joi.string().required(),
        ven: Joi.string().required(),
        sam: Joi.string().required(),
        dim: Joi.string().required()
    });

    validateRequest(req, next, schema);
}

function adrCre(req, res, next) {
    console.log('---------------------------------  adrCre');
    const schema = Joi.object({
        //numero: Joi.string().required(),
        //voie: Joi.string().required(),
        //codePostale: Joi.string().required(),
        ville: Joi.string().required()
    });
    validateRequestSous(req.body.Adresse, next, schema,);
}

function horCre(req, res, next) {
    console.log('---------------------------------  adrCre');
    const schema = Joi.object({
        matinDebut: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
        matinFin: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
        soirDebut: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        soirFin: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
    });
    validateRequestSous(req.body.HorairePraticien, next, schema,);
}