/**
* Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {

    e.addEventListener('submit', function(event) {

      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      //alert('action=' + action + '    recaptcha=' + recaptcha);

      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit1(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        var fctAjax;
        if('/adr/rchAdresse'== action){
          fctAjax = rechercherRdvVal;
        }else if('/contact/message'== action){
          fctAjax = contacterMessage;
        }else{
          alert('Pas de fonction encore !!!  fctAjax=' + fctAjax);
        }
        recherche_praticien_submit(fctAjax, thisForm, action, formData);
      }
    });
  });


  const rechercherRdvVal = function () {

    return new Promise((resolve, reject) => {
      
      var criterRch = {
        id_speCat: $("#id_speCat").val(),
        specialite: $("#specialite").val(),
        ville: $("#ville").val()
      };
      var data = JSON.stringify(criterRch);
      alert('rechercherRdvVal data=' + data);
      $.ajax({
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        url: "/adr/rchAdresse",
        cache: false,
        data: data,
        success: function (data) {
          var dataFmt = JSON.stringify(data);
          console.log("success---ok=" + dataFmt);  
          return resolve(data);
        },
        error: function (data) {   
          return reject(`${data.status} ${data.statusText} ${data.url} ${data.responseText}`);
          var err = JSON.stringify(data.responseJSON);
          console.log("ERREUR---KO=" + err);
        }
      });
    });
    //alert('FIN rechercherRdvVal()...2');
  }

 
  const contacterMessage = function () {

    return new Promise((resolve, reject) => {
      
      var contact = {
        nom: $("#contact_nom").val(),
        email: $("#contact_email").val(),
        sujet: $("#contact_sujet").val(),
        message: $("#contact_message").val()
      };
      var dataC = JSON.stringify(contact);
      alert('contacterMessage data=' + dataC);
      $.ajax({
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        url: "/contact/message",
        cache: false,
        data: dataC,
        success: function (dataC) {
          var dataFmt = JSON.stringify(dataC);
          console.log("success---ok=" + dataFmt);  
          return resolve(dataC);
        },
        error: function (dataC) {   
          return reject(`${dataC.status} ${dataC.statusText} ${dataC.url} ${dataC.responseText}`);
          var err = JSON.stringify(data.responseJSON);
          console.log("ERREUR---KO=" + err);
        }
      });
    });
    //alert('FIN rechercherRdvVal()...2');
  }

  function recherche_praticien_submit(fctAjax, thisForm, action, formData) {

    //alert(' recherche_praticien_submit --- fctAjax=' + fctAjax );

    fctAjax().then(response => {    
      if( response) {
        afficherResultat(response);
        return JSON.stringify(response)
      } else {
        alert('KOOOOO response=' + response);
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        // permet d initialiser le form
        //thisForm.reset(); 
      } else {
        alert('22 KOOOOO response=' + data);
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
    
  }

  function displayError(thisForm, error) {
    alert('displayError');
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }


})();
