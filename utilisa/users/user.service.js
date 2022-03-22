const bcrypt = require('bcryptjs');
//const db = require('utilisa/_helpers/db');
const db = require('db/dbMysql2');
const jwt = require('jsonwebtoken');
let consAuth = require("_const/auth");


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByEmail,
    connect
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);

    // hash password
    user.passwordHash = await bcrypt.hash(params.password, 10);

    // save user
    await user.save();
    return user;
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}


async function getByEmail(email) {
    return await getUserByEmail(email);
}

async function connect(params, res) {
    console.log('---------------------------------  connect sevice password = ' + params.password);
    var passwordHash = await bcrypt.hash(params.password, 10);
    console.log('---------------------------------  connect sevice passwordHash = ' + passwordHash);

    var user = await getUserByEmail(params.email);

    console.log('---------------------------------  connect sevice user.passwordHash = ' + user.passwordHash);

    bcrypt.compare(params.password, user.passwordHash, (err, data) => {
        //if error than throw error
        if (err) throw err;
        //if both match than you can do anything
        if (data) {
            console.log('---------------------------------  connect sevice okk success ');

            let username = user.email;
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
                userId: user.id,
                token: accessToken
            });
        } else {

            message = "KO";
            console.log('---------------------------------  connect sevice Invalid credencial ');
            res.status(401).json({ msg: "Invalid credencial" })
            //throw 'Mot de passe incorrecte';
        }

    });
    return user;
}

async function getUserByEmail(email) {
    const user = await db.User.findOne({ where: { email: email } });
    if (!user) throw 'User not found';
    return user;
}
