require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('pubm'));


//app.use('/pubm', express.static('pubm'));

//app.use(express.static('public'));
app.use('/public', express.static('public'));


app.use(express.json());

app.use(cors());

// api routes
// dans les 3 serveurs
app.use('/spe', require('./specialite/specialite.controller'));
app.use('/adr', require('./praticien/adresse.controller'));
app.use('/vil', require('./referentiels/ville.controller'));

app.use('/contact', require('./contact/contact.controller'));
//app.use('/rdvs', require('./rdvs/rdv.controller'));

// !!! NE PAS DEPLACER CETTE LIGNE, le statut de la reponse passe de 400 a 500
//Important que ce soit declarer a la fin; car cela modifie la reponse du html a json
// global error handler, par exemple la validation des forms Joi fct validateRequest qui revois le message JSON 
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => console.log('Server listening on port ' + port));

process.on('uncaughtException', function (err) {
    console.log(JSON.stringify(process.memoryUsage()));
    console.error("LA uncaughtException est leve, le prog s arrette. " + err + ", stacktrace: " + err.stack);
    return process.exit(1);
});
/*
process.nextTick(function () {
    throw new Error("Une Maivaise Error");
});
*/

// demmarage du cache
//let cacheProvider = require('./cache-provider');
//cacheProvider.start();