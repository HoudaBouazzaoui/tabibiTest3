const express = require('express');
const bodyParser = require("body-parser");
const verifyToken = require("_middleware/auth");
const rdvService = require('./rdv.service');

const patientMiddelW = require("patient/patient.middleware");


const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const router = express.Router();
router.get('/rdvs', verifyToken.verifyToken, getListeRdvsPraticien);
router.get('/rdvlib', verifyToken.verifyToken, getListeRdvsPatientLibre);
router.get('/rdvlib1', getListeRdvsPatientLibre1);
router.post('/creerRDV', verifyToken.verifyToken, patientMiddelW.createSchema, creerRdvETPatien);
router.get('/supp/:id', suprimerRdv);

router.get('/RdvById', getListeRdvById);

//router.get('/rdvs' , getListeRdvs);

module.exports = router;

function getListeRdvsPraticien(req, res, next) {
    console.log('-------------rdv.controller----DEB----------------  getListeRdvsPraticien');
    //return rdvService.getListeRdvsPraticien(req).then(rdvs => res.json(rdvs)).catch(next);
    var listRdv = rdvService.getListeRdvsPraticien(req).then(rdvs => transformRdvsToEvents(rdvs))
        .then(events => res.json(events)).catch(next);
    //console.log('----listRdv = ' + JSON.stringify(listRdv) );
    //var listeEvents = transformRdvsToEvents(listRdv);
    console.log('-------------rdv.controller----FIN----------------  getListeRdvsPraticien');
    return listRdv;
}
async function transformRdvsToEvents(rdvs) {
    var events = [];
    console.log('----transformRdvsToEvents ---deb-----');
    for (rdv of rdvs) {
        var ev = {
            id: rdv.id,
            title: rdv.motif,
            start: rdv.dateDebut,
            end: rdv.dateFin,
            todo: 'todo on peut ajouter une description ou autre'
        };
        events.push(ev);
        6
    }
    console.log('----transformRdvsToEvents ----fin----');
    return events;
}

function getListeRdvsPatientLibre(req, res, next) {
    console.log('-------------rdv.controller----DEB----------------  getListeRdvsPatientLibre');
    //return rdvService.getListeRdvsPraticien(req).then(rdvs => res.json(rdvs)).catch(next);

    var listRdv = rdvService.getListeRdvsPatientLibre(req).then(rdvs => transformRdvsLIBREToEvents(rdvs, req))
        .then(events => res.json(events)).catch(next);
    console.log('-------------rdv.controller----FIN----------------  getListeRdvsPatientLibre');
    return listRdv;
}
async function getListeRdvsPatientLibre1(req, res, next) {
    console.log('-------------rdv.controller----DEB----------------  getListeRdvsPatientLibre1 ==' + req.praticiens);

    var criterRch = req.body;
    console.log('ccccccc-----req.criterRch=' + JSON.stringify(criterRch));

    const rdvHandler = require('./rdv.handler');
    const listEvent = await rdvHandler.getRdvLibre(req);

    res.json(listEvent);
    console.log('-------------rdv.controller----FIN----------------  getListeRdvsPatientLibre1');
    return listEvent;
}


async function transformRdvsLIBREToEvents(rdvs, req, idPraticien) {
    var events = [];
    console.log('----transformRdvsLIBREToEvents ---deb-----taille=' + rdvs.length + ' ' + JSON.stringify(rdvs));

    let taille = rdvs.length;

    if (taille == 0) {
        throw 'pas de rdvs';
    }
    const rdv = rdvs[0];
    const lala = new Date();
    if (lala < rdv.dateDebut) {
        var ev = {
            id: rdv.id + '-DEB',
            title: 'LIB',
            start: lala,
            end: rdv.dateDebut
        };
        events.push(ev);
    }

    for (let i = 0; i < taille; i++) {
        const rdv = rdvs[i];
        const indPre = i + 1;
        if (indPre < taille) {
            const rdvPrece = rdvs[indPre];
            if (rdv.dateFin < rdvPrece.dateDebut) {
                var ev = {
                    id: rdv.id + '-' + rdvPrece.id,
                    title: 'LIB',//rdv.motif,
                    start: rdv.dateFin,
                    end: rdvPrece.dateDebut
                };
                events.push(ev);
            }
        }
    }

    const rdvF = rdvs[taille - 1];
    var evF = {
        id: rdvF.id + '-FIN',
        title: 'LIB',
        start: rdvF.dateFin
        //end: rdv.dateDebut
    };
    events.push(evF);

    events = transformRdvsLibreHoraire(events, req, idPraticien);
    console.log('----transformRdvsLIBREToEvents ----fin----');
    return events;
}

function creerRdvETPatien(req, res, next) {
    console.log('--------DEB--------controller----------------  creerRdvETPatien');

    var patient = rdvService.creerRdvETPatien(req, res)

    //console.log(req.body.user.name);
    //console.log(req.body.user.email);
    console.log('--------FIN--------controller----------------  creerRdvETPatien');
    res.send(patient);
}

function suprimerRdv(req, res, next) {
    console.log('--------DEB--------controller----------------  suuprimerRdv');
    rdvService.suprimerRdv(req.params.id)
        .then(() => res.json({ message: 'RDV deleted' }))
        .catch(next);
    console.log('--------FIN--------controller----------------  suuprimerRdv');
}

function getListeRdvById(req, res, next) {
    console.log('--------------------rdv.controller-------------  getListeRdvById');
    const rdv = require('./rdv.service');
    const result = rdv.getListeRdvById(3, res);
}

async function transformRdvsLibreHoraire(rdvs, req, idPraticien) {
    console.log('DEB---------rdv.controller-----  transformRdvsLibreHoraire');
    const horairePraticienId = req.payload.praticien.HorairePraticienId;
    const horaireService = require('praticien/horairePraticien.service');
    const horairePraticien = await horaireService.getHorairePraticien(horairePraticienId);
    //const horairePraticien = await horaireService.getById(idPraticien);

    console.log('-------------------------horairePraticien===' + JSON.stringify(horairePraticien));

    const jourRepos = getJourRepos(horairePraticien);

    const matinFin = horairePraticien.matinFin; // TODO to use
    const soirDebut = horairePraticien.soirDebut; // TODO to use

    const matinDebut_H = horairePraticien.matinDebut.split(':')[0];
    const matinDebut_M = horairePraticien.matinDebut.split(':')[1];
    const soirFin_H = horairePraticien.soirFin.split(':')[0];
    const soirFin_M = horairePraticien.soirFin.split(':')[1];

    console.log('§§§------transformRdvsLibreHoraire   matinDebut_H=' + matinDebut_H + '  matinDebut_M=' + matinDebut_M);
    console.log('§§§------transformRdvsLibreHoraire   soirFin_H=' + soirFin_H + '  soirFin_M=' + soirFin_M);

    var events = [];
    let taille = rdvs.length;
    for (let i = 0; i < taille; i++) {
        var ev = null;
        var rdv = null;
        rdv = rdvs[i];
        ev = {
            id: rdv.id,
            title: rdv.title,
            start: rdv.start,
            end: rdv.end
        };

        const jourDelaSemaine = rdv.start.getDay();
        if (jourRepos.indexOf(jourDelaSemaine) == -1) {
            console.log('-------GGGGGGG------------getDay===' + rdv.start.getDay());
        }
        console.log('-------------------getDay===' + rdv.start.getDay());
        var timeDebut_H = rdv.start.getHours();

        //console.log('§§§---rdv.start=' + rdv.start);
        //console.log('§§§-----rdv.end=' + rdv.end);

        if (rdv.end && rdv.start.getDate() < rdv.end.getDate()) {

            //console.log('§§§---soirFin_H=' + soirFin_H + '---timeDebut_H=' + timeDebut_H);

            var nbJourDiff = rdv.end.getDate() - rdv.start.getDate();// TODO 
            //console.log('-----------------------nbJourDiff=' + nbJourDiff);

            if (soirFin_H < timeDebut_H) {
                // console.log('*** 1 seul ev pour demain');
                ev.start.setDate(rdv.start.getDate() + 1);
                ev.start.setHours(matinDebut_H);
                ev.start.setMinutes(matinDebut_M);
            } else {
                //console.log('*** 2 evs pour auj et demain');
                //console.log('rdv.start=' + rdv.start + '---rdv.end=' + rdv.end);

                var j = 0;
                do {
                    var ev1 = {
                        id: rdv.id + 'Splite 1',
                        title: rdv.title,
                        start: new Date(rdv.start),
                        end: new Date(rdv.start)
                    };
                    ev1.start.setDate(ev1.start.getDate() + j);
                    ev1.end.setDate(ev1.end.getDate() + j);
                    ev1.end.setHours(soirFin_H);
                    ev1.end.setMinutes(soirFin_M);

                    if (j > 0) { // cas ou diff de 2 rdvs est plus de 1 jours donc init les jours precedents a l ouverture
                        ev1.start.setHours(matinDebut_H);
                        ev1.start.setMinutes(matinDebut_M);
                    }

                    console.log('-------GGGGGGG------------getDay1===' + ev1.start.getDay());
                    if (jourRepos.indexOf(ev1.start.getDay()) == -1) {
                        events.push(ev1); // un event en plus, TODO peut etre meme nbJourDiff events en plus 
                    }


                    j = j + 1;

                } while (j < nbJourDiff);

                ev.id = rdv.id + 'Splite 2'
                ev.start.setDate(rdv.end.getDate());
                ev.start.setHours(matinDebut_H);
                ev.start.setMinutes(matinDebut_M);
            }
        }

        if (timeDebut_H < matinDebut_H) {
            ev.start.setHours(matinDebut_H);
            ev.start.setMinutes(matinDebut_M);
        }

        console.log('-------GGGGGGG------------getDay===' + ev.start.getDay());
        if (jourRepos.indexOf(ev.start.getDay()) == -1) {
            events.push(ev); // un event en plus, TODO peut etre meme nbJourDiff events en plus 
        }


    }
    console.log('FIN---------rdv.controller-----  transformRdvsLibreHoraire');
    return events;
}


function getJourRepos(horairePraticien) {

    var jourRepos = '';
    jourRepos += horairePraticien.dim ? '' : '0';
    jourRepos += horairePraticien.lun ? '' : '1';
    jourRepos += horairePraticien.mar ? '' : '2';
    jourRepos += horairePraticien.mer ? '' : '3';
    jourRepos += horairePraticien.jeu ? '' : '4';
    jourRepos += horairePraticien.ven ? '' : '5';
    jourRepos += horairePraticien.sam ? '' : '6';

    console.log('--*-*-*-*-*-/*-*-*-*-*-*-*--*-*-*---jourRepos' + jourRepos);

    return jourRepos;
}






async function transformRdvsLIBREToEventsOLD(rdvs, req) {
    var events = [];
    console.log('----transformRdvsLIBREToEvents ---deb-----taille=' + rdvs.length + ' ' + JSON.stringify(rdvs));

    let taille = rdvs.length;
    if (taille == 1) {
        const rdv = rdvs[0];
        const lala = new Date();
        if (lala < rdv.dateDebut) {
        }
        var ev = {
            id: rdv.id + '-DEB',
            title: 'LIB',
            start: lala,
            end: rdv.dateDebut
        };
        events.push(ev);
        var ev1 = {
            id: rdv.id + '-FIN',
            title: 'LIB',
            start: rdv.dateFin
            //end: rdv.dateDebut
        };
        events.push(ev1);
    } else {
        for (let i = 0; i < taille; i++) {
            const rdv = rdvs[i];
            const indPre = i + 1;
            if (indPre < taille) {
                const rdvPrece = rdvs[indPre];
                if (rdv.dateFin < rdvPrece.dateDebut) {
                    var ev = {
                        id: rdv.id + '-' + rdvPrece.id,
                        title: 'LIB',//rdv.motif,
                        start: rdv.dateFin,
                        end: rdvPrece.dateDebut
                    };
                    events.push(ev);
                }
            }
        }
    }

    //events = transformRdvsLibreHoraire(events, req);
    console.log('----transformRdvsLIBREToEvents ----fin----');
    return events;
}











function getListeRdvs(req, res, next) {
    console.log('-------------rdv.controller----DEB----------------  getListeRdvs');

    //const result = rdv.getListeRdvs(res);
    return rdvService.getListeRdvs(req).then(rdvs => res.json(rdvs)).catch(next);


    /*
        try {
            const result = rdvService.getListeRdvs();
            
            //res.json(result);
            console.log('-------------CONTROLLER-----FIN1---------------  getListeRdvs');
            return res.json(result);
            //return res.json({elements: result});
        } catch(e) {
            console.log('------------------ERRRR---------------  getListeRdvs' + e);
            console.log(e); // console log the error so we can see it in the console
            res.sendStatus(500);
        }
        console.log('-------------CONTROLLER-----FIN2---------------  getListeRdvs');
    */
}

function creerRdvOLD(req, res, next) {
    console.log('-----------------rdv.controller----------------  creerRdv');
    var dateRDV = req.body.dateRDV;
    var dateRdvFin = req.body.dateRDVFin;

    var titre = req.body.titre;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var telephone = req.body.telephone;
    var dateNaissance = req.body.dateNaissance;
    console.log(dateRDV);
    console.log(dateRdvFin);
    console.log(titre);
    console.log(nom);
    console.log(prenom);
    console.log(dateNaissance);
    console.log(telephone);


    var praticien = req.payload.praticien;
    console.log('--------------------rdv.controller-------------  praticien.id=' + praticien.id);
    let idPraticien = praticien.id;

    var patienData = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        dateNaissance: req.body.dateNaissance
    };
    var rdvData = {
        ID_PAT: 0,
        ID_PRA: idPraticien,
        MOTIF: req.body.motif,
        DATERDVDEB: req.body.dateRDV,
        DATERDVFIN: req.body.dateRDVFin
    };

    const rdv = require('./rdv.service');
    var idPatien = rdv.creerPatien(patienData);
    rdvData.ID_PAT = idPatien;
    rdv.creerRdv(rdvData);

    //console.log(req.body.user.name);
    //console.log(req.body.user.email);
    res.send("creerRDV");
}

app.get('/codeTabibi/bo/lesRDV.html', function (request, response) {
    response.sendFile('D:/projets/web/tabibi/rdvs/public/codeTabibi/bo/lesRDV.html');
});

app.get('/creerRDV', function (req, res) {
    console.log('/creerRDV');
    res.send("creerRDV");
});

/*
app.post('/creerRDV', function (req, res) {
    console.log('/creerRDV');

    var dateRDV = req.body.dateRDV;
    var dateRdvFin = req.body.dateRDVFin;
    
    var titre = req.body.titre;
    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var dateNaissance = req.body.dateNaissance;
    console.log(dateRDV);
    console.log(dateRdvFin);
    console.log(titre);
    console.log(nom);
    console.log(prenom);
    console.log(dateNaissance);

    var patienData = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        dateNaissance : req.body.dateNaissance
    };
    var rdvData = {
        ID_PAT : 0,
        MOTIF : req.body.titre,
        DATERDVDEB : req.body.dateRDV,
        DATERDVFIN : req.body.dateRDVFin 
    };

    const rdv = require('./rdv');
    var idPatien = rdv.creerPatien(patienData);
    rdvData.ID_PAT = idPatien;
    rdv.creerRdv(rdvData);
    
    //console.log(req.body.user.name);
    //console.log(req.body.user.email);
    res.send("creerRDV");
});
*/


/*
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/rdvs', function (req, res) {
    const rdv = require('./rdv');
    const result = rdv.getListRdvs(res);

});

app.get('/RdvById', function (req, res) {
    const rdv = require('./rdv');
    const result = rdv.getListeRdvById(3 , res);
});
*/

/*
const port = 3000;
app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Book service`);
})
*/


