const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');

function createSchema(req, res, next) {
    const url = req.url;
    console.log('----------------patient.middleware-----------------  createSchema req.url =' + req.url);
    if(url === '/creerRDV'){// pour une creation de rdv par pratitient
        console.log('----patient.middleware-------  createSchema POUR CREATION RDV PAR PRATICIEN');
        const schema = Joi.object({
            titre: Joi.string().required(),
            nom: Joi.string().required(),
            prenom: Joi.string().required(),
            dateNaissance: Joi.string().required(),           
            telephone: Joi.string().min(10).required()
        });
        validateRequest(req, next, schema);
    }else{
        console.log('----patient.middleware-------  createSchema POUR CREATION DE PATIENT ');
        const schema = Joi.object({
            titre: Joi.string().required(),
            nom: Joi.string().required(),
            prenom: Joi.string().required(),
            dateNaissance: Joi.string().required(),
            telephone: Joi.string().min(10).required(),
            email: Joi.string().email().required(),
            motpasse: Joi.string().min(6).required(),
            motpasseConfirme: Joi.string().valid(Joi.ref('motpasse')).required()
        });
        validateRequest(req, next, schema);
    }

}

function updateSchema(req, res, next) {
    // TODO
    console.log('------------------patient.middleware---------------  updateSchema');
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

module.exports = {
    createSchema
};