require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/users', require('./utilisa/users/users.controller'));
app.use('/rdvs', require('./rdvs/rdv.controller'));
app.use('/pra', require('./praticien/praticien.controller'));
app.use('/spe', require('./specialite/specialite.controller'));
app.use('/pat', require('./patient/patient.controller'));
app.use('/hor', require('./praticien/horairePraticien.controller'));



app.get('/codeTabibi/bo/lesRDV.html', function (request, response) {
    response.sendFile('D:/projets/web/tabibi/rdvs/public/codeTabibi/bo/lesRDV.html');
});

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
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