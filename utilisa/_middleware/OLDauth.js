const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
    console.log('------------------DEB---------------  verifyToken');
    const token = req.headers.cookie;
    var accessToken = token.split('jwt=')[1];
    console.log('-------accessToken = ' + accessToken);
    let payload
    try {
        if (!accessToken) {
            console.log('-------NOOOOOO token = ');
            return res.status(403).send()
        }
        let payload
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
        console.log('-------payload = ' + payload);
        next()
    }
    catch (e) {
        //if an error occured return request unauthorized error
        return res.status(401).send()
    }
    console.log('------------------FIN---------------  verifyToken');
    return next();

    /*
    
    const token = req.headers.cookie || req.body.token || req.query.token || req.headers["x-access-token"];

    console.log('-------token = ' + token);
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        console.log('-------decoded = ' + decoded);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
*/
};

const logToken = (req, res, next) => {


    console.log('----------------DEB-----------------  logToken');
    const token = req.headers.cookie || req.body.token || req.query.token || req.headers["x-access-token"];
    console.log('-------token1 = ' + token);
    const token2 = req.headers.cookie["x-access-token"];
    console.log('-------token2 = ' + token2);
    //const token = req.body.token || req.query.token || req.headers["x-access-token"];

    /*
        try {
            var cookie = req.headers.cookie;
            console.log('-----req.stringify=' + JSON.stringify(req.headers));
            console.log('-----req.headers.cookie"=' +req.headers.cookie);
        } catch (err) {
            console.log('------------------ERRRR-  logToken' + err);
        }
    */
    /*
        const token = req.headers.cookie || req.body.token || req.query.token || req.headers["x-access-token"];
    
        console.log('-------token = ' + token);
        if (!token) {
            console.log('-------NOOOOOO token = ');
            //return res.status(403).send("A token is required for authentication");
        }
        try {
           // const decoded = jwt.verify(token, config.TOKEN_KEY);
            const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            console.log('-------decoded = ' + decoded);
            //req.user = decoded;
        } catch (err) {
            //return res.status(401).send("Invalid Token");
            console.log('------------------ERRRR-  Invalid Token' + err);
        }
    */
    var ACCESS_TOKEN_SECRET = 'swsh23hjddnns';
    var ACCESS_TOKEN_LIFE = '120';
    var REFRESH_TOKEN_SECRET = 'dhw782wujnd99ahmmakhanjkajikhiwn2n';
    var REFRESH_TOKEN_LIFE = '86400';


    try {
        console.log('-------accessToken = ' + req.cookies);
        var accessToken = token.split('jwt=')[1];
        // let accessToken = req.cookies.jwt;
        console.log('-------accessToken = ' + accessToken);
        //if there is no token stored in cookies, the request is unauthorized
        if (!accessToken) {
            console.log('-------NOOOOOO token = ');
            //return res.status(403).send()
        }
        let payload
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
        console.log('-------payload = ' + payload);
        //next()
    }
    catch (e) {
        //if an error occured return request unauthorized error
        //return res.status(401).send()
        console.log('------------------ERRRR-  Invalid Token' + e)
    }
    console.log('----------------FIN-----------------  logToken');
    return next();
};

//module.exports = verifyToken;
module.exports = {
    verifyToken,
    logToken
};
