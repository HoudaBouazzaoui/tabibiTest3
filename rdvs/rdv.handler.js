const express = require('express');
const bodyParser = require("body-parser");
const verifyToken = require("_middleware/auth");
const rdvService = require('./rdv.service');

const patientMiddelW = require("patient/patient.middleware");



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
    }
    console.log('----transformRdvsToEvents ----fin----');
    return events;
}



async function getRdvLibre(req) {

    console.log('!!!!!!!!!! DEB getRdvLibre');
    const praticienService = require('praticien/praticien.service');
    const rdvService1 = require('./rdv.service');
    const listePraticiens = await praticienService.getAll();

    var listEvent = [];

    for (let i = 0; i < listePraticiens.length; i++) {
        const praticien = listePraticiens[i];
        console.log('***----forEach------------  pra.id=' + praticien.id);
        const idPraticien = praticien.id;

        var rdvs = await rdvService1.getListeRdvsLibre1(req, idPraticien);

        var events = await transformRdvsLIBREToEvents(rdvs, req, idPraticien);

        var rdvsPra = {
            idPra: idPraticien,
            nom: praticien.nom,
            prenom: praticien.prenom,
            rdvs: events
        };

        //listEvent.push(events);
        listEvent.push(rdvsPra);
    }
    console.log('!!!!!!!!!! FIN getRdvLibre');
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


async function transformRdvsLibreHoraire(rdvs, req, idPraticien) {
    console.log('DEB---------rdv.controller-----  transformRdvsLibreHoraire');
    const horaireService = require('praticien/horairePraticien.service');
    //const horairePraticien = await horaireService.getHorairePraticien(req);
    const horairePraticien = await horaireService.getById(idPraticien);


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

        var timeDebut_H = rdv.start.getHours();

        console.log('§§§---rdv.start=' + rdv.start);
        console.log('§§§-----rdv.end=' + rdv.end);

        if (rdv.end && rdv.start.getDate() < rdv.end.getDate()) {

            console.log('§§§---soirFin_H=' + soirFin_H + '---timeDebut_H=' + timeDebut_H);

            var nbJourDiff = rdv.end.getDate() - rdv.start.getDate();// TODO 
            console.log('-----------------------nbJourDiff=' + nbJourDiff);


            console.log('+++++++++++++++++ doooo i=' + j);

            if (soirFin_H < timeDebut_H) {
                console.log('*** 1 seul ev pour demain');
                ev.start.setDate(rdv.start.getDate() + 1);
                ev.start.setHours(matinDebut_H);
                ev.start.setMinutes(matinDebut_M);
            } else {
                console.log('*** 2 evs pour auj et demain');
                console.log('rdv.start=' + rdv.start + '---rdv.end=' + rdv.end);

                var j = 0;
                do {

                    var ev1 = {
                        id: rdv.id + 'Splite 1',
                        title: rdv.title,
                        start: new Date(ev.start),
                        end: new Date(ev.start)
                    };
                    ev1.start.setDate(ev1.start.getDate() + j);
                    ev1.end.setDate(ev1.end.getDate() + j);

                    ev1.end.setHours(soirFin_H);
                    ev1.end.setMinutes(soirFin_M);

                    if (j > 0) { // cas ou diff de 2 rdvs est plus de 1 jours donc init les jours precedents a l ouverture
                        ev1.start.setHours(matinDebut_H);
                        ev1.start.setMinutes(matinDebut_M);
                    }
                    events.push(ev1); // un event en plus, TODO peut etre meme nbJourDiff events en plus 

                    j = j + 1;

                } while (j < nbJourDiff);

                ev.id = rdv.id + 'Splite 2'
                ev.start.setDate(rdv.end.getDate());
                ev.start.setHours(matinDebut_H);
                ev.start.setMinutes(matinDebut_M);
            }


            /*
                        if (soirFin_H < timeDebut_H) {
                            console.log('*** 1 seul ev pour demain');
                            ev.start.setDate(ev.end.getDate());
                            ev.start.setHours(matinDebut_H);
                            ev.start.setMinutes(matinDebut_M);
                        } else {
                            console.log('*** 2 evs pour auj et demain');
                            console.log('rdv.start=' + rdv.start + '---rdv.end=' + rdv.end);
            
                            var ev1 = {
                                id: ev.id + 'Splite 1',
                                title: ev.title,
                                start: new Date(rdv.start),
                                end: new Date(rdv.start)
                            };
                            ev1.end.setHours(soirFin_H);
                            ev1.end.setMinutes(soirFin_M);
                            events.push(ev1); // un event en plus, TODO peut etre meme nbJourDiff events en plus 
            
                            ev.id = ev.id + 'Splite 2'
                            ev.start.setDate(ev.end.getDate());
                            ev.start.setHours(matinDebut_H);
                            ev.start.setMinutes(matinDebut_M);
                        }
            */
        }

        if (timeDebut_H < matinDebut_H) {
            ev.start.setHours(matinDebut_H);
            ev.start.setMinutes(matinDebut_M);
        }

        events.push(ev);

    }
    console.log('FIN---------rdv.controller-----  transformRdvsLibreHoraire');
    return events;
}



module.exports = {
    getRdvLibre
}