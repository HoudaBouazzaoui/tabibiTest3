const fs = require("fs");
const db = require('db/dbMysql2');
const Image = db.Image;

const sharp = require('sharp');

async function uploadFiles(req, res) {

    console.log('------------------DEB img DERV---------------  uploadFiles');
    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        var dataImg = fs.readFileSync("./resources/static/assets/uploads/" + req.file.filename);

        // const bufferOut = await sharp(dataImg).resize({ width: 250, height: 250 }).toBuffer();
        const bufferOut = await sharp(dataImg).resize({ width: 250 }).toBuffer();

        const profil = new db.Profil({
            typeImg: req.file.mimetype,
            nomImg: req.file.originalname,
            //data: fs.readFileSync("./resources/static/assets/uploads/" + req.file.filename),
            dataImg: bufferOut
        });
        await profil.save();
        const profilId = profil.id;
        var praticien = req.payload.praticien;
        const praticienId = praticien.id;
        console.log('-----------  praticien.id=' + praticienId + '---------  profilId=' + profilId);
        const result = await db.Praticien.update(
            { ProfilId: profilId },
            { where: { id: praticienId } }
        );


        console.log('------------------DEB img DERV---------------  uploadFiles CREAT ProfilId=' + profilId);
        fs.writeFileSync("./resources/static/assets/tmp/" + "-petit-" + profil.nomImg, profil.dataImg);

        return res.send(`File has been uploaded.`);

    } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload images: ${error}`);
        //throw `Une erreur de telechargement de l image: ${error}`;
    }
    console.log('------------------DEB img DERV---------------  uploadFiles');
}
module.exports = {
    uploadFiles,
};


async function uploadFilesOld(req, res) {

    console.log('------------------DEB img DERV---------------  uploadFiles');
    try {
        console.log(req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }

        var dataImg = fs.readFileSync("./resources/static/assets/uploads/" + req.file.filename);

        // const bufferOut = await sharp(dataImg).resize({ width: 250, height: 250 }).toBuffer();
        const bufferOut = await sharp(dataImg).resize({ width: 250 }).toBuffer();

        const image = new db.Image({
            typeImg: req.file.mimetype,
            nomImg: req.file.originalname,
            //data: fs.readFileSync("./resources/static/assets/uploads/" + req.file.filename),
            dataImg: bufferOut
        });

        var praticien = req.payload.praticien;
        console.log('---------------  praticien.id=' + praticien.id);
        image.PraticienId = praticien.id;

        await image.save();

        console.log('------------------DEB img DERV---------------  uploadFiles CREAT id=' + image.id);
        fs.writeFileSync("./resources/static/assets/tmp/" + "-petit-" + image.nom, image.data);

        return res.send(`File has been uploaded.`);

    } catch (error) {
        console.log(error);
        //return res.send(`Error when trying upload images: ${error}`);
        throw `Une erreur de telechargement de l image: ${error}`;
    }
    console.log('------------------DEB img DERV---------------  uploadFiles');
}
