const bcrypt = require('bcryptjs');
const db = require('db/dbMysql2');
const jwt = require('jsonwebtoken');
let consAuth = require("_const/auth");
const adresseService = require('./adresse.service');


module.exports = {
    create
    , update
    , connect
    //,delete: _delete  
    , getByIdComplet
    , getAll
    , getAllComplete
    , getById

    , getAllCompleteNonValide
    , validerPraticien
};


async function create(params) {
    // TODO peut etre mettre une transaction afin errors to rollback car 2 creation adresse et praticien
    console.log('------------------DEB SERVICE PRATICIEN---------------  create params=' + params);
    // validate
    if (await db.Praticien.findOne({ where: { email: params.email } })) {
        //throw 'Validation error: "email" ' + params.email + ' is already registered';
        throw ' "email" ' + params.email + ' is already registered';
    }

    const adresse = await adresseService.create(params.Adresse);
    console.log('------------------ SERVICE PRATICIEN 111 ---------------  adresse =' + adresse);

    const horaireService = require('./horairePraticien.service');
    const horairePraticien = await horaireService.create(params.HorairePraticien);
    console.log('------------------ SERVICE PRATICIEN 112 ---------------  horaire =' + JSON.stringify(horairePraticien));

    const praticien = new db.Praticien(params);
    console.log('------------------ SERVICE PRATICIEN 222---------------  praticien =' + praticien);


    // hash password
    praticien.motpasse = await bcrypt.hash(params.motpasse, 10);

    praticien.AdresseId = adresse.id;
    praticien.HorairePraticienId = horairePraticien.id;
    console.log('------------------ SERVICE PRATICIEN 333---------------  praticien.passwordHash =' + praticien.passwordHash);

    praticien.valide = false;
    // save praticien
    await praticien.save();
    console.log('------------------FIN SERVICE PRATICIEN---------------  create');
    return praticien;
}

async function update(id, params, uniquementPra) {

    console.log('------------------DEB SERVICE PRATICIEN---------------  update id=' + id);
    console.log('------------------DEB SERVICE PRATICIEN---------------  update params=' + params);
    //const praticien = await getPraticien(id);
    const praticien = await getByIdComplet(id);

    // TODO changement du username et pws voir si nexiste pas dans la base 
    // faire le changement des params de connexion dans une autre fonction dediee
    /*
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.Praticien.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }
    */

    // ne pas modifier les params de connexioooo
    params.email = praticien.email;
    params.motpasse = praticien.motpasse;

    if( ! uniquementPra){// MAJ de  l adresse et horaire egalement
        const idA = praticien.Adresse.id;// MAJ de l adresse obj Adresse
        const adresse = await adresseService.update(idA, params.adresse);
    
        const idH = praticien.HorairePraticien.id;// MAJ des horaires obj HorairePraticien 
        const horaireService = require('./horairePraticien.service');
        const horairePraticien = await horaireService.update(idH, params.horairePraticien);
    }

    Object.assign(praticien, params);// MAJ du Praticien obj Praticien 
    await praticien.save();

    console.log('------------------FIN SERVICE PRATICIEN---------------  update');
}

async function connect(params, res) {
    console.log('------------------DEB---------------  connect praticien servicepassword = ' + params.password);
    var passwordHash = await bcrypt.hash(params.password, 10);
    console.log('-------------------1--------------  connect praticien servicepasswordHash = ' + passwordHash);

    let praticienPay = await getByEmail(params.email);

    console.log('*************--THE praticien.HorairePraticienId = ' + praticienPay.HorairePraticienId);

    if (!praticienPay) { // TODO
        throw 'L email est inconnue';
    }

    console.log('-------------------2--------------  connect praticien servicepraticien.passwordHash = ' + praticienPay.passwordHash);

    bcrypt.compare(params.password, praticienPay.motpasse, (err, data) => {
        //if error than throw error
        if (err) throw err;
        //if both match than you can do anything
        if (data) {
            console.log('---------------3------------------  connect praticien serviceokk success');

            //use the payload to store information about the user such as username, user role, etc.
            let payload = { praticien: praticienPay };

            let accessToken = jwt.sign(payload, consAuth.ACCESS_TOKEN_SECRET, {
                algorithm: consAuth.ALGORITHM,
                expiresIn: consAuth.ACCESS_TOKEN_LIFE
            })

            //create the refresh token with the longer lifespan
            let refreshToken = jwt.sign(payload, consAuth.REFRESH_TOKEN_SECRET, {
                algorithm: consAuth.ALGORITHM,
                expiresIn: consAuth.REFRESH_TOKEN_LIFE
            })

            //send the access token to the client inside a cookie
            res.cookie(consAuth.ACCESS_TOKEN_NOM, accessToken, { secure: true, httpOnly: true })

            res.status(200).json({
                msg: "Login success",
                userId: praticienPay.id,
                token: accessToken
            });
        } else {

            message = "KO";
            console.log('---------------------------------  connect praticien serviceMot de passe incorrecte ');
            res.status(401).json({ msg: "Mot de passe incorrecte" })
            //throw 'Mot de passe incorrecte';
        }

    });
    return praticienPay;
}

async function _delete(id) {
    const praticien = await getPraticien(id);
    await praticien.destroy();
}

async function getPraticien(id) {
    const praticien = await db.Praticien.findByPk(id, { include: [{ model: db.Adresse, as: 'Adresse' }] });
    if (!praticien) throw 'praticien not found';
    return praticien;
}

async function getByIdComplet(id) {
    return await getByIdComplet(id);
}
async function getByIdComplet(id) {
    const praticien = await db.Praticien.findByPk(id, { include: [{ model: db.Adresse, as: 'Adresse' }, { model: db.HorairePraticien, as: 'HorairePraticien' }, { model: db.Profil, as: 'Profil' }] });

    // Image profile decode
    if (praticien.Profil) {
        praticien.Profil.dataImg = Buffer.from(praticien.Profil.dataImg).toString('base64');
    }

    return praticien;
}

async function getAll() {
    return await db.Praticien.findAll();
}

async function getAllComplete() {
    return await db.Praticien.findAll({ include: [{ model: db.Adresse, as: 'Adresse' }] });
}

async function getById(id) {
    return await getPraticien(id);
}

async function getByEmail(email) {
    const praticient = await db.Praticien.findOne({ where: { email: email } });
    if (!praticient) throw 'Utilisateur Inconnu';
    return praticient;
}

async function getAllCompleteNonValide() {
    return await db.Praticien.findAll({ where: { valide: false }, include: [{ model: db.Adresse, as: 'Adresse' }, { model: db.HorairePraticien, as: 'HorairePraticien' }, { model: db.Profil, as: 'Profil' }] });
}

async function validerPraticien(idPra) {
    console.log('------------------DEB SERVICE validerPraticien------  idPra=' + idPra);
    await db.Praticien.update({ valide: true }, { where: { id: idPra } });
    console.log('------------------FIN SERVICE validerPraticien------');
}