require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('pubp'));
app.use('/pubp', express.static('pubp'));
app.use(cors());
// global error handler, par exemple la validation des forms Joi fct validateRequest qui revois le message JSON 
app.use(errorHandler);

// api routes
// dans les 3 serveurs
app.use('/spe', require('./specialite/specialite.controller')); 
app.use('/pra', require('./praticien/praticien.controller'));
app.use('/hor', require('./praticien/horairePraticien.controller'));
app.use('/adr', require('./praticien/adresse.controller'));
app.use('/rdvs', require('./rdvs/rdv.controller'));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 7000;
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