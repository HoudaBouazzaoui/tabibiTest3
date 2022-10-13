const fs = require("fs");
const db = require('db/dbMysql2');
const Image = db.Image;
let cst = require("_const/cst");
const pathImgUploadOld = "./resources/static/assets/uploads/";
const pathImgUpload = "./resources/imgProfil/uploads/";
const pathImgTempsOld = "./resources/static/assets/tmp/";
const pathImgTemps = "./resources/imgProfil/tmp/";

const sharp = require('sharp');

async function uploadFiles(req, res, origi, idPra, idProfil) {

    console.log('--------DEB img DERV-------------  uploadFiles  idPraticien=' + idPra);

    var praticienId = null;

    if (idPra && origi && origi == cst.user.G) {
        console.log('--------DEB img DERV-------GGGGGGGGGGGGG------  uploadFiles  origi=' + origi);
        praticienId = idPra;
    } else {
        console.log('--------DEB img DERV-------OOOOTTTRRREE------  uploadFiles  origi=' + origi);
        praticienId = req.payload.praticien.id;
    }

    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        var dataImg = fs.readFileSync(pathImgUpload + req.file.filename);

        // const bufferOut = await sharp(dataImg).resize({ width: 250, height: 250 }).toBuffer();

        // l ajout de withMetadata() ou rotate() permet de corriger le bug de la rotation de qq image
        //const bufferOut = await sharp(dataImg).resize({ width: 250 }).withMetadata().toBuffer();
        const bufferOut = await sharp(dataImg).rotate().resize({ width: 250 }).toBuffer();

        var profil;
        if (idProfil) { // maj profil
            profil = await getProfil(idProfil);
            console.log('------- img DERV------  uploadFiles EXIste idProfil=' + idProfil + ' +++++  profil.id=' + profil.id);
            console.log('wiwiwiwiwiwiwiwiwiwiwiwi update profil====' + JSON.stringify(profil));
            profil.typeImg = req.file.mimetype;
            profil.nomImg = req.file.originalname;
            profil.dataImg = bufferOut;
        } else {// creation du profil
            console.log('------- img DERV-------------  uploadFiles NOOO idProfil=' + idProfil);
            profil = new db.Profil({
                typeImg: req.file.mimetype,
                nomImg: req.file.originalname,
                //data: fs.readFileSync(pathImgUpload + req.file.filename),
                dataImg: bufferOut
            });

        }

        await profil.save();

        const profilId = profil.id;

        // TODO il faut gerer la modification lorsque le profil existe deja
        console.log('-----------  praticien.id=' + praticienId + '---------  profilId=' + profilId);
        const result2 = await db.Praticien.update(
            { ProfilId: profilId },
            { where: { id: praticienId } }
        );


        console.log('------------------DEB img DERV---------------  uploadFiles CREAT ProfilId=' + profilId);
        fs.writeFileSync(pathImgTemps + "-petit-" + profil.nomImg, profil.dataImg);

        return res.send(`File has been uploaded.`);

    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload images: ${error}`);
        //throw `Une erreur de telechargement de l image: ${error}`;
    }
    console.log('------------------DEB img DERV---------------  uploadFiles');
}

async function supprimerProfil(req, res, origi, idPra, idProfil) {

    console.log('--------DEB img DERV-------------  supprimerProfil  idPraticien=' + idPra);
    var praticienId = null;
    if (idPra && origi && origi == cst.user.G) {
        console.log('--------DEB img DERV-------GGGGGGGGGGGGG------  supprimerProfil  origi=' + origi);
        praticienId = idPra;
    } else {
        console.log('--------DEB img DERV-------OOOOTTTRRREE------  supprimerProfil  origi=' + origi);
        praticienId = req.payload.praticien.id;
    }

    if (idProfil) { // maj profil
        const profil = await getProfil(idProfil);
        console.log('------- img DERV------  suppppp EXIste idProfil=' + idProfil + ' +++++  profil.id=' + profil.id);
        await _delete(idProfil);
        // TODO il faut gerer la modification lorsque le profil existe deja
        console.log('-----miste a jour praticien PK ProfilId=NULL------  praticienId=' + praticienId );
        const result2 = await db.Praticien.update(
            { ProfilId: null },
            { where: { id: praticienId } }
        );
    } else {// creation du profil

    }
    console.log('------------------FIN img DERV---------------  supprimerProfil ');
    return res.send('Limage est supprimeeeeeee');
}

module.exports = {
    uploadFiles
    ,supprimerProfil
    ,getProfil
};

async function getProfil(id) {
    const profil = await db.Profil.findByPk(id);
    if (!profil) throw 'Profil not found';
    return profil;
}

async function _delete(id) {
    const profil = await getProfil(id);
    await profil.destroy();
}

async function uploadFilesOld(req, res) {

    console.log('------------------DEB img DERV---------------  uploadFiles');
    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        var dataImg = fs.readFileSync(pathImgUpload + req.file.filename);

        // const bufferOut = await sharp(dataImg).resize({ width: 250, height: 250 }).toBuffer();
        const bufferOut = await sharp(dataImg).resize({ width: 250 }).toBuffer();

        const image = new db.Image({
            typeImg: req.file.mimetype,
            nomImg: req.file.originalname,
            //data: fs.readFileSync(pathImgUpload + req.file.filename),
            dataImg: bufferOut
        });

        var praticien = req.payload.praticien;
        console.log('---------------  praticien.id=' + praticien.id);
        image.PraticienId = praticien.id;

        await image.save();

        console.log('------------------DEB img DERV---------------  uploadFiles CREAT id=' + image.id);
        fs.writeFileSync(pathImgTemps + "-petit-" + image.nom, image.data);

        return res.send(`File has been uploaded.`);

    } catch (error) {
        console.log(error);
        //return res.send(`Error when trying upload images: ${error}`);
        throw `Une erreur de telechargement de l image: ${error}`;
    }
    console.log('------------------DEB img DERV---------------  uploadFiles');
}
