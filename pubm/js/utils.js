function recupererSpecialite(cache, idSelect) {
    const urlspe = '/spe' + cache;
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: urlspe,
        cache: true,
        success: function (data) {
            selectSpecialite(data, idSelect);
            
            var speStr = JSON.stringify(data);
            console.log("success ok speStr = " + speStr);
        },
        error: function (xhr, desc, err) {
            $("#successModal .modal-body p").text('error = ' + xhr.responseJSON.message);
            console.log(xhr.responseJSON.message);
            console.log("Details0: " + desc + "\nError:" + err);
        }
    });
}


function selectSpecialite(jsonData, idSelect) {

    var listItems = '<option value>Spécialité ...</option>';
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

        id: $("#praId").val(),
        AdresseId: $("#AdresseId").val(),
        HorairePraticienId: $("#HorairePraticienId").val(),

        image: $("#imgProfil").files,

        id_speCat: $("#id_speCat").val(),

        titre: $("#titre").val(),
        nom: $("#nom").val(),
        prenom: $("#prenom").val(),
        dateNaissance: $("#dateNaissance").val(),

        email: $("#email").val(),

        telephone: $("#telephone").val(),
        fax: $("#fax").val(),

        motpasse: $("#motpasse").val(),
        motpasseConfirme: $("#motpasseConfirme").val(),

        Adresse: {
            numero: $("#numero").val(),
            voie: $("#voie").val(),
            codePostale: $("#codePostale").val(),
            ville: $("#ville").val()
        },
        HorairePraticien: {
            matinDebut: $("#matinDebut").val(),
            matinFin: $("#matinFin").val(),
            soirDebut: $("#soirDebut").val(),
            soirFin: $("#soirFin").val(),

            lun: $("#lun").val(),
            mar: $("#mar").val(),
            mer: $("#mer").val(),
            jeu: $("#jeu").val(),
            ven: $("#ven").val(),
            sam: $("#sam").val(),
            dim: $("#dim").val()
        }
    };

    return praticien;
}

function peuplerFormPraticien(pra) {

    //image: $("#imgProfil").files;

    $("#praId").val(pra.id);
    $("#AdresseId").val(pra.AdresseId);
    $("#HorairePraticienId").val(pra.HorairePraticienId);

    $("#id_speCat").val(pra.id_speCat);

    $("#titre").val(pra.titre);
    $("#nom").val(pra.nom);
    $("#prenom").val(pra.prenom);
    $("#dateNaissance").val(dateStrYYYYMMDD(pra.dateNaissance, '-'));

    $("#email").val(pra.email);

    $("#telephone").val(pra.telephone);
    $("#fax").val(pra.fax);

    $("#motpasse").val(pra.motpasse);

    $("#numero").val(pra.Adresse.numero);
    $("#voie").val(pra.Adresse.voie);
    $("#codePostale").val(pra.Adresse.codePostale);
    $("#ville").val(pra.Adresse.ville)

    $("#matinDebut").val(pra.HorairePraticien.matinDebut);
    $("#matinFin").val(pra.HorairePraticien.matinFin);
    $("#soirDebut").val(pra.HorairePraticien.soirDebut);
    $("#soirFin").val(pra.HorairePraticien.soirFin);

    $("#lun").prop('checked', pra.HorairePraticien.lun);
    $("#mar").prop('checked', pra.HorairePraticien.mar);
    $("#mer").prop('checked', pra.HorairePraticien.mer);
    $("#jeu").prop('checked', pra.HorairePraticien.jeu);
    $("#ven").prop('checked', pra.HorairePraticien.ven);
    $("#sam").prop('checked', pra.HorairePraticien.sam);
    $("#dim").prop('checked', pra.HorairePraticien.dim);

    $("#lun").val(pra.HorairePraticien.lun);
    $("#mar").val(pra.HorairePraticien.mar);
    $("#mer").val(pra.HorairePraticien.mer);
    $("#jeu").val(pra.HorairePraticien.jeu);
    $("#ven").val(pra.HorairePraticien.ven);
    $("#sam").val(pra.HorairePraticien.sam);
    $("#dim").val(pra.HorairePraticien.dim);

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

