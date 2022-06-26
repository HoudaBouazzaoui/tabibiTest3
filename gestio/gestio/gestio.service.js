const bcrypt = require('bcryptjs');
const db = require('db/dbMysql2');
const jwt = require('jsonwebtoken');
let consAuth = require("_const/auth");
const Role = require('./role');
//const adresseService = require('./adresse.service');


module.exports = {
    create
    ,update
    ,connect
    //,delete: _delete  
    ,getByIdComplet
    ,getAll
    ,getAllComplete
    ,getById
};


async function create(params) {

    console.log('------------------DEB SERVICE GEStio---------------  create params=' + params);
    // validate
    if (await db.Gestio.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const gestio = new db.Gestio(params);
    gestio.role = Role.User;
    console.log('------------------ SERVICE GEStio 222---------------  GEStio =' + gestio);

    // hash password
    gestio.motpasse = await bcrypt.hash(params.motpasse, 10);

    // save GEStio
    await gestio.save();
    console.log('------------------FIN SERVICE GEStio---------------  create');
    return gestio;
}

async function connect(params, res) {
    console.log('------------------DEB---------------  connect gestioPay servicepassword = ' + params.password);
    var passwordHash = await bcrypt.hash(params.password, 10);
    console.log('-------------------1--------------  connect gestioPay servicepasswordHash = ' + passwordHash);

    let gestioPay = await getGestioByEmail(params.email);
    if (!gestioPay){ // TODO
        throw 'L email est inconnue';
    }      

    bcrypt.compare(params.password, gestioPay.motpasse, (err, data) => {
        
        if (err) throw err;//if error than throw error
        
        if (data) {//if both match than you can do anything
            console.log('---------------3------------------  connect gestio serviceokk success');
            //use the payload to store information about the user such as username, user role, etc.
            let payload = { gestio: gestioPay };
            
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
                userId: gestioPay.id,
                token: accessToken
            });
            
        } else {
            message = "KO";
            console.log('---------------------------------  connect gestio serviceMot de passe incorrecte ');
            res.status(401).json({ msg: "Mot de passe incorrecte" })
            //throw 'Mot de passe incorrecte';
        }

    });
    return gestioPay;
}


async function update(id, params) {

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

    const idA = praticien.Adresse.id;
    //const adresse = await adresseService.update(idA, params.adresse);

    const idH = praticien.HorairePraticien.id;
    const horaireService = require('./horairePraticien.service');
    const horairePraticien = await horaireService.update(idH, params.horairePraticien);

    // copy params to Praticien and save
    Object.assign(praticien, params);
    await praticien.save();
    console.log('------------------FIN SERVICE PRATICIEN---------------  update');
}

async function _delete(id) {
    const praticien = await getPraticien(id);
    await praticien.destroy();
}

async function getPraticien(id) {
    const praticien = await db.Praticien.findByPk(id , { include: [{model: db.Adresse, as: 'Adresse'}]});
    if (!praticien) throw 'praticien not found';
    return praticien;
}

async function getByIdComplet(id) {
    return await getByIdComplet(id);
}
async function getByIdComplet(id) {
    const praticien = await db.Praticien.findByPk(id , { include: [{model: db.Adresse, as: 'Adresse'},{model: db.HorairePraticien, as: 'HorairePraticien'},{model: db.Profil, as: 'Profil'}]});
    
    // Image profile decode
    if (praticien.Profil){
        praticien.Profil.dataImg = Buffer.from(praticien.Profil.dataImg).toString('base64');
    }  
      
    return praticien;
}

async function getAll() {
    return await db.Praticien.findAll();
}

async function getAllComplete() {
    return await db.Praticien.findAll({ include: [{model: db.Adresse, as: 'Adresse'}]});
}

async function getById(id) {
    return await getPraticien(id);
}

async function getGestioByEmail(email) {
    const gestio = await db.Gestio.findOne({ where: { email: email } });
    if (!gestio) throw 'Utilisateur Inconnu';
    return gestio;
}
