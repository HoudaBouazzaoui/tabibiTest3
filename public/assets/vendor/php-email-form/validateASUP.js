/**
* PHP Email Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  alert('public');

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    alert('forEachforEachforEach public');

    e.addEventListener('submit', function(event) {

      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      alert('action=' + action + 'recaptcha=' + recaptcha);

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
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });


  function rechercherRdvVal() {

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
          var iwa = JSON.stringify(data);
          //$("#afficheResu p").text(iwa);
          //afficherResultat(data);
          console.log("success     okkkk=" + iwa);
          //return data;
          
          return resolve(data);
        },
        error: function (data) {
          
          return reject(`${data.status} ${data.statusText} ${data.url} ${data.responseText}`);
          throw new Error('error ajax='); 
          alert('error ajax=');
          var iwa = JSON.stringify(data.responseJSON);
          $("#resu").html(iwa);
          //alert('rechercherRdvVal()... --error iwa=' + iwa);
          console.log("ORROR     KOOO=" + iwa);
          throw new Error(iwa); 
        }
      });
    });
    //alert('FIN rechercherRdvVal()...2');
  }

  function php_email_form_submit(thisForm, action, formData) {

    alert('php_email_form_submit OLDDD=' + formData);

    //$.when(rechercherRdvVal()).then(response => {
    rechercherRdvVal().then(response => {
      
      alert('responseresponseresponseresponse response=' + response);
      if( response) {
        alert('OKKKKKKKK response=' + JSON.stringify(response));
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
        alert('11 OKKKKKKKK response=');
        //alert('11 OKKKKKKKK response=' + data);
        thisForm.querySelector('.sent-message').classList.add('d-block');
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
