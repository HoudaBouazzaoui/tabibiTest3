function recupererSpecialite(cache, idSelect) {
    //const urlspe = 'http://localhost:4000/spe' + cache;
    const urlspe = '/spe' + cache;
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: urlspe,
        cache: true,
        success: function (data) {
            var iwa = JSON.stringify(data);
            //$("#successModal .modal-body p").text('creerr = ' + data.id);
            console.log("success     okkkk" + iwa);
            selectSpecialite(data, idSelect);
        },
        error: function (xhr, desc, err) {
            $("#successModal .modal-body p").text('error = ' + xhr.responseJSON.message);
            console.log(xhr.responseJSON.message);
            console.log("Details0: " + desc + "\nError:" + err);
        }
    });
}


function selectSpecialite(jsonData, idSelect) {

    var listItems = '<option value>Select one...</option>';
    //var listItems = '<option selected="selected" value="">- Select -</option>';
    /*
    for (var i = 0; i < jsonData.length; i++) {
        listItems += "<option value='" + jsonData[i].id_speCat + "'>" + jsonData[i].titre + "</option>";
    }
*/
    Object.entries(jsonData).forEach(([key, value]) => {
        console.log(` `);
        listItems += "<option value='" + `${key}` + "'>" + `${value}` + "</option>";
    });

    $(idSelect).html(listItems);
}

function construirePraticien() {

    var praticien = {

        id: $("#creerPraticien #praId").val(),

        image: $("#imgProfil").files,

        id_speCat: $("#creerPraticien #id_speCat").val(),

        titre: $("#creerPraticien #titre").val(),
        nom: $("#creerPraticien #nom").val(),
        prenom: $("#creerPraticien #prenom").val(),
        dateNaissance: $("#creerPraticien #dateNaissance").val(),

        email: $("#creerPraticien #email").val(),

        telephone: $("#creerPraticien #telephone").val(),
        fax: $("#creerPraticien #fax").val(),

        motpasse: $("#creerPraticien #motpasse").val(),
        motpasseConfirme: $("#creerPraticien #motpasseConfirme").val(),

        adresse: {
            numero: $("#creerPraticien #numero").val(),
            voie: $("#creerPraticien #voie").val(),
            codePostale: $("#creerPraticien #codePostale").val(),
            ville: $("#creerPraticien #ville").val()
        },
        horairePraticien: {
            matinDebut: $("#creerPraticien #matinDebut").val(),
            matinFin: $("#creerPraticien #matinFin").val(),
            soirDebut: $("#creerPraticien #soirDebut").val(),
            soirFin: $("#creerPraticien #soirFin").val(),

            lun: $("#creerPraticien #lun").val(),
            mar: $("#creerPraticien #mar").val(),
            mer: $("#creerPraticien #mer").val(),
            jeu: $("#creerPraticien #jeu").val(),
            ven: $("#creerPraticien #ven").val(),
            sam: $("#creerPraticien #sam").val(),
            dim: $("#creerPraticien #dim").val()
        }
    };

    return praticien;
}

function peuplerFormPraticien(pra) {

    //image: $("#imgProfil").files;

    $("#creerPraticien #praId").val(pra.id);

    $("#creerPraticien #id_speCat").val(pra.id_speCat);

    $("#creerPraticien #titre").val(pra.titre);
    $("#creerPraticien #nom").val(pra.nom);
    $("#creerPraticien #prenom").val(pra.prenom);
    $("#creerPraticien #dateNaissance").val(dateStrYYYYMMDD(pra.dateNaissance, '-'));

    $("#creerPraticien #email").val(pra.email);

    $("#creerPraticien #telephone").val(pra.telephone);
    $("#creerPraticien #fax").val(pra.fax);

    $("#creerPraticien #motpasse").val(pra.motpasse);

    $("#creerPraticien #numero").val(pra.Adresse.numero);
    $("#creerPraticien #voie").val(pra.Adresse.voie);
    $("#creerPraticien #codePostale").val(pra.Adresse.codePostale);
    $("#creerPraticien #ville").val(pra.Adresse.ville)

    $("#creerPraticien #matinDebut").val(pra.HorairePraticien.matinDebut);
    $("#creerPraticien #matinFin").val(pra.HorairePraticien.matinFin);
    $("#creerPraticien #soirDebut").val(pra.HorairePraticien.soirDebut);
    $("#creerPraticien #soirFin").val(pra.HorairePraticien.soirFin);

    $("#creerPraticien #lun").prop('checked', pra.HorairePraticien.lun);
    $("#creerPraticien #mar").prop('checked', pra.HorairePraticien.mar);
    $("#creerPraticien #mer").prop('checked', pra.HorairePraticien.mer);
    $("#creerPraticien #jeu").prop('checked', pra.HorairePraticien.jeu);
    $("#creerPraticien #ven").prop('checked', pra.HorairePraticien.ven);
    $("#creerPraticien #sam").prop('checked', pra.HorairePraticien.sam);
    $("#creerPraticien #dim").prop('checked', pra.HorairePraticien.dim);

    $("#creerPraticien #lun").val(pra.HorairePraticien.lun);
    $("#creerPraticien #mar").val(pra.HorairePraticien.mar);
    $("#creerPraticien #mer").val(pra.HorairePraticien.mer);
    $("#creerPraticien #jeu").val(pra.HorairePraticien.jeu);
    $("#creerPraticien #ven").val(pra.HorairePraticien.ven);
    $("#creerPraticien #sam").val(pra.HorairePraticien.sam);
    $("#creerPraticien #dim").val(pra.HorairePraticien.dim);

}

function dateStrYYYYMMDD(d, sP) {
    d = new Date(d);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}${sP}${month}${sP}${day}`;
}

function dateStrDDMMYYYY(laDat) {
    let laDate = new Date(laDat);
    let dd = laDate.getDate();
    let mm = laDate.getMonth() + 1;
    const yyyy = laDate.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const dateFormate = dd + '/' + mm + '/' + yyyy;
    return dateFormate;
}

