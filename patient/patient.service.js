const bcrypt = require('bcryptjs');
const db = require('db/dbMysql2');
const jwt = require('jsonwebtoken');
let consAuth = require("_const/auth");
const Sequelize = require("sequelize");
//const adresseService = require('./adresse.service');

module.exports = {
    rechercherPatientsDePraticien,
    getAll,
    getById,
    create,
    update,
    delete: _delete
    //getByEmail,
    //connect
};


async function rechercherPatientsDePraticien(req) {
    console.log('----DEB SERVICE Patient------rechercherPatientsDePraticien');
    var praticien = req.payload.praticien;
    let idPraticien = praticien.id;
    console.log('----DEB SERVICE Patient------rechercherPatientsDePraticien  praticien.id=' + praticien.id);

    const nom = req.params.nom;

    console.log('----DEB SERVICE Patient------rechercherPatientsDePraticien  nom=' + nom);
    
    const Op = Sequelize.Op;
    //const rdvs = db.Rdv.findAll({raw: true, where: { id_pra: idPraticien } });
    //const patients = await db.Patient.findAll({raw: true, where: { nom: { [Op.like]: `%${nom}%` } } });
    const patients = await db.Patient.findAll({
        raw: true,
         where: {
            [Op.and]: [{nom: { [Op.like]: `%${nom}%` }}, { PraticienId : idPraticien }],        
        } 
    });

    console.log('----FIN SERVICE Patient------rechercherPatientsDePraticien');

    return patients;
}

async function getAll() {
    return await db.Patient.findAll();
}

async function getById(id) {
    return await getPatient(id);
}

async function create(params) {
    // TODO peut etre mettre une transaction afin errors to rollback car 2 creation adresse et Patient
    console.log('------------------DEB SERVICE Patient---------------  create params=' + params);
    // validate
    if (await db.Patient.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const patient = new db.Patient(params);
    console.log('------------------ SERVICE Patient 222---------------  Patient =' + Patient);

    // hash password
    patient.motpasse = await bcrypt.hash(params.motpasse, 10);

    console.log('------------------ SERVICE Patient 333---------------  Patient.passwordHash =' + patient.passwordHash);

    // save Patient
    await patient.save();
    console.log('------------------FIN SERVICE Patient---------------  create');
    return patient;
}

async function update(id, params) {
    // TODO
    const Patient = await getPatient(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.Patient.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to Patient and save
    Object.assign(Patient, params);
    await Patient.save();
}

async function _delete(id) {
    const Patient = await getPatient(id);
    await Patient.destroy();
}

async function getPatient(id) {
    const Patient = await db.Patient.findByPk(id, { include: [{ model: db.Adresse, as: 'Adresse' }] });
    if (!Patient) throw 'Patient not found';
    return Patient;
}

/*
async function getByEmail(email) {
    return await getPatientByEmail(email);
}

async function connect(params, res) {
    console.log('---------------------------------  connect sevice password = ' + params.password);
    var passwordHash = await bcrypt.hash(params.password, 10);
    console.log('---------------------------------  connect sevice passwordHash = ' + passwordHash);

    var Patient = await getPatientByEmail(params.email);

    console.log('---------------------------------  connect sevice Patient.passwordHash = ' + Patient.passwordHash);

    bcrypt.compare(params.password, Patient.passwordHash, (err, data) => {
        //if error than throw error
        if (err) throw err;
        //if both match than you can do anything
        if (data) {
            console.log('---------------------------------  connect sevice okk success ');
            let username = Patient.email;

            //use the payload to store information about the user such as username, user role, etc.
            let payload = { username: username };          
            let accessToken = jwt.sign(payload, consAuth.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: consAuth.ACCESS_TOKEN_LIFE
            })
            //create the refresh token with the longer lifespan
            let refreshToken = jwt.sign(payload, consAuth.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: consAuth.REFRESH_TOKEN_LIFE
            })
            //store the refresh token in the user array
            //users[username].refreshToken = refreshToken
            //send the access token to the client inside a cookie
            res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
            //res.send()  
            res.status(200).json({
                msg: "Login success",
                userId: Patient.id,
                token: accessToken
            });
        } else {

            message = "KO";
            console.log('---------------------------------  connect sevice Invalid credencial ');
            res.status(401).json({ msg: "Invalid credencial" })
            //throw 'Mot de passe incorrecte';
        }

    });
    return Patient;
}
async function getPatientByEmail(email) {
    const Patient = await db.Patient.findOne({ where: { email: email } });
    if (!Patient) throw 'Patient not found';
    return Patient;
}
*/