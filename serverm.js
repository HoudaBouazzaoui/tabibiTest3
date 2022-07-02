require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('pubm'));

//app.use('/pubm', express.static('pubm'));



app.use(express.json());

app.use(cors());

// api routes
// dans les 3 serveurs
app.use('/spe', require('./specialite/specialite.controller'));
app.use('/adr', require('./praticien/adresse.controller'));
//app.use('/rdvs', require('./rdvs/rdv.controller'));

/*
app.get('/codeTabibi/bo/lesRDV.html', function (request, response) {
    response.sendFile('D:/projets/web/tabibi/rdvs/public/codeTabibi/bo/lesRDV.html');
});
*/

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