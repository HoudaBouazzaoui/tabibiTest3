const express = require("express");
const router = express.Router();
const logger = require('_utils/logger');



router.post("/message", envoyerMessage);
module.exports = router;

function envoyerMessage(req, res, next) {

  

    logger.info('-----contact.controller-----envoyerMessage');
    var contact = req.body;
    logger.info('-----req.message=' + JSON.stringify(contact));
     
    const nom = contact.nom;
    const email = contact.email;
    const sujet = contact.sujet;
    const message = contact.message;

    console.log('-----nom = ' + nom+'-----email = ' + email+'-----sujet = ' + sujet+'-----message = ' + message);

    var nodemailer = require('nodemailer');
/*
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tabibi.service@gmail.com',
        pass: '.ta1bi2bi'
      }
    });

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: 'tabibi.service@gmail.com',
          pass: '.ta1bi2bi'
        }
     });
   */ 


     var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          //pass: "7c23f8420b18a9"
          pass: process.env.MAIL_PASSWORD
        }
      });

    var mailOptions = {
      from: email,
      to: 'tabibi.service@gmail.com',
      subject: sujet,
      text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('-errorerrorerrorerror----contact.controller-----sendMail');
        console.log(error);
        logger.error(error.message);
        //throw 'Erreur lors de l envoi du message!';
        res.status(500).json({ msg: error });
      } else {
        console.log('******* ******** ********** Email sent: ' + info.response);
        res.json({ message: 'Message OK' });
      }
      

    });


/*


curl --ssl-reqd \
--url 'smtp://smtp.mailtrap.io:2525' \
--user 'c481a752c5a527:7c23f8420b18a9' \
--mail-from from@example.com \
--mail-rcpt to@example.com \
--upload-file - <<EOF
From: Magic Elves <from@example.com>
To: Mailtrap Inbox <to@example.com>
Subject: You are awesome!
Content-Type: multipart/alternative; boundary="boundary-string"

--boundary-string
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

Congrats for sending test email with Mailtrap!

Inspect it using the tabs above and learn how this email can be improved.
Now send your email using our fake SMTP server and integration of your choice!

Good luck! Hope it works.

--boundary-string
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Disposition: inline

<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body style="font-family: sans-serif;">
    <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
      <p>Inspect it using the tabs you see above and learn how this email can be improved.</p>
      <img alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png" style="width: 100%;">
      <p>Now send your email using our fake SMTP server and integration of your choice!</p>
      <p>Good luck! Hope it works.</p>
    </div>
    <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
    <style>
      .main { background-color: white; }
      a:hover { border-left-width: 1em; min-height: 2em; }
    </style>
  </body>
</html>

--boundary-string--
EOF






    const praticien = req.payload.praticien;
    const horairePraticienId = praticien.HorairePraticienId;
    horaireService.getHorairePraticien(horairePraticienId).then(horairePraticien => res.json(horairePraticien))
        .catch(next);
        */
}
