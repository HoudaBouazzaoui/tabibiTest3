let constants = {
    // origine lors le creation du praticien
    creerPar:{
        Gestio: 'G',
        Praticien: 'P'
    },

    // utilisateur connecte, lors de lutisation d un service de recherche par ex 
    user:{
        G: 'G',
        Pr: 'Pr',
        Pa: 'Pa'
    }
};

module.exports = Object.freeze(constants);