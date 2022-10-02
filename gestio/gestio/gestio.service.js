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
    ,getGestioById
    ,getGestioCompletById
    //,delete: _delete
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

    let gestio = await getGestioByEmail(params.email);
    if (!gestio){ // TODO
        throw 'L email est inconnue';
    }      

    bcrypt.compare(params.password, gestio.motpasse, (err, data) => {
        
        if (err) throw err;//if error than throw error
        
        if (data) {//if both match than you can do anything
            console.log('---------------3------------------  connect gestio serviceokk success');
            // utilisation du payload pour stoke les information du gestio 
            // faire une copie du gestio sans motpasse et ids afin de le stoke
            const gestioPaySansIds = JSON.parse(JSON.stringify(gestio));
            //delete gestioPaySansIds['id'];
            delete gestioPaySansIds['motpasse'];
            delete gestioPaySansIds['email'];
            let payload = { gestio: gestioPaySansIds };
            
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
                //userId: gestioPay.id,
                token: accessToken
            });
            
        } else {
            message = "KO";
            console.log('---------------------------------  connect gestio serviceMot de passe incorrecte ');
            res.status(401).json({ msg: "Mot de passe incorrecte" })
            //throw 'Mot de passe incorrecte';
        }

    });
    return gestio;
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

async function getGestioCompletById(id) {
    const gestio = await db.Gestio.findByPk(id);
    if (!gestio) throw 'praticien not found';
    return gestio;
}

async function getGestioById(id) {
    const gestio = await db.Gestio.scope('sansIds').findByPk(id);
    if (!gestio) throw 'praticien not found';
    return gestio;
}

async function getGestioByEmail(email) {
    const gestio = await db.Gestio.findOne({ where: { email: email } });
    if (!gestio) throw 'Utilisateur Inconnu';
    return gestio;
}


async function _delete(id) {
    const praticien = await getPraticien(id);
    await praticien.destroy();
}