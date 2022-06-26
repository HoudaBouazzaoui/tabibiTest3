require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('pub'));

app.use('/pub', express.static('pub'));

//app.use('/public', express.static('public'));
//app.use('/static', express.static(__dirname + '/public'));

//var path = require('path');
//app.use('/static',express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static(__dirname + '/public'));


app.use(express.json());

app.use(cors());

// api routes
app.use('/gest', require('./gestio/gestio/gestio.controller'));
// dans les 2 serveurs
app.use('/spe', require('./specialite/specialite.controller')); 
//app.use('/pra', require('./praticien/praticien.controller'));
app.use('/pra', require('./gestio/praticien.controller'));
app.use('/adr', require('./gestio/adresse.controller'));
app.use('/hor', require('./gestio/horairePraticien.controller'));

/*
app.get('/codeTabibi/bo/lesRDV.html', function (request, response) {
    response.sendFile('D:/projets/web/tabibi/rdvs/public/codeTabibi/bo/lesRDV.html');
});
*/

// global error handler, par exemple la validation des forms Joi fct validateRequest qui revois le message JSON 
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
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