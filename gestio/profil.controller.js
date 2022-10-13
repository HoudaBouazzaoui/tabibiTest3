const express = require("express");
const router = express.Router();
//const homeController = require("../controllers/home");
const profilService = require("../praticien/profil.service");
const uploadMiddleware = require("../praticien/profil.middleware");
let cst = require("_const/cst");

const verifyToken = require("_middleware/auth");

router.post("/upload/:idPra/:idProfil", verifyToken.verifyToken, uploadMiddleware.single("file"), uploadImageProfil);
router.get("/upload/:idPra/:idProfil", verifyToken.verifyToken, supprimerProfil);

//router.put('/mod/:id',verifyToken.verifyToken, valForm.horUp, update);// TODO verifyToken


/* a supp
function getByIdPraticien(req, res, next) {
    console.log('-----horairePraticien.controller-----getByIdPraticien');
    const horairePraticienId = req.payload.praticien.HorairePraticienId;
    horaireService.getHorairePraticien(horairePraticienId)
        .then(horairePraticien => res.json(horairePraticien))
        .catch(next);
}
*/

function uploadImageProfil(req, res, next) {
    // TODO si y a deja profil faut faire maj en lieu de creation
    console.log('********************************************************************************');
    console.log('********************************************************************************');
    console.log('********************************************************************************');
    console.log('--GEST---gestio\profil.controller.js -----uploadImageProfil');

    //const idPra = req.params.id;
    const idPra = req.params.idPra;
    let idProfil =  req.params.idProfil;
    (idProfil =='nan') ? idProfil=null : idProfil=idProfil;

    console.log('*************idPra=' +idPra+'*************idProfil=' +idProfil+'******************************************************');

    console.log('---------------------------------  update body=' + JSON.stringify(req.body));
    // on verifie l id praticien avec l id praticien envoye
    if(!idPra){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        profilService.uploadFiles(req, res, cst.user.G, idPra, idProfil);
    }
}

function supprimerProfil(req, res, next) {
    // TODO si y a deja profil faut faire maj en lieu de creation
    console.log('*****************supprimerProfil***************************************************************');
    console.log('*********************supprimerProfil***********************************************************');
    console.log('****************************supprimerProfil****************************************************');


    //const idPra = req.params.id;
    const idPra = req.params.idPra;
    let idProfil =  req.params.idProfil;
    (idProfil =='nan') ? idProfil=null : idProfil=idProfil;

    console.log('*************idPra=' +idPra+'*************idProfil=' +idProfil+'******************************************************');

    console.log('---------------------------------  update body=' + JSON.stringify(req.body));
    // on verifie l id praticien avec l id praticien envoye
    if(!idPra || !idProfil){
        //res.json({ message: 'Il ya un probleme d identifiant' });
        throw 'Il ya un probleme d identifiant';
    }else{
        profilService.supprimerProfil(req, res, cst.user.G, idPra, idProfil);
    }
}

module.exports = router;
