//module.exports = validateRequest;
module.exports = {
    validateRequest
    ,validateRequestSous
};

function validateRequest(req, next, schema) {
    console.log('---------------------------------  validateRequest');
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        console.log('---------------------------------  validateRequest error');
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}


function validateRequestSous(obj, next, schema) {
    console.log('---------------------------------  validateRequestSous = ' + JSON.stringify(obj));
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: false // remove unknown props
    };
    const { error, value } = schema.validate(obj, options);
    if (error) {
        console.log('---------------------------------  validateRequestSous error');
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        console.log('---------------------------------  validateRequestSous OK');
        //req.body = value;
        next();
    }
}

