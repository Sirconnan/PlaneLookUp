/************************************************************************************************************************************************************************/
/***************************************************************  Variables globales  ***********************************************************************************/
/************************************************************************************************************************************************************************/

const BTN_REASSAYER_IDENTIFICATION = document.getElementById("btn_reassayer_identification"); // Le bouton pour réessayer l'identification
const P_ERREUR = document.getElementById("p_erreur"); // Le paragraphe d'erreur

const TABLE_MDP = document.getElementById("table_mdp"); // Le tableau des mots de passe
const NOTIF = document.querySelector('.mdl-js-snackbar'); // La notification
const KEY = "sae302"; // La clé de chiffrement

const SELECT_RETIRER_MDP = document.getElementById("select_retirer_mdp"); // La liste déroulante des mots de passe à supprimer

const ARTICLE_ERREUR = document.getElementById("erreur_identification");
const ARTICLE_AFFICHE_MDP = document.getElementById("afficher_mdp"); // L'article contenant les mots de passe
const ARTICLE_AJOUT_MDP = document.getElementById("ajouter_mdp"); // L'article contenant le formulaire d'ajout de mot de passe
const ARTICLE_SUPR_MDP = document.getElementById("retirer_mdp"); // L'article contenant le formulaire de suppression de mot de passe

const INPUT_NOM = document.getElementById("nom_mdp"); // L'input du nom de l'application
const INPUT_LOGIN = document.getElementById("login_mdp"); // L'input du login de l'application
const INTPUT_MDP = document.getElementById("mdp_mdp"); // L'input du mot de passe
const INTPUT_VERIF_MDP = document.getElementById("verif_mdp_mdp"); // L'input de vérification du mot de passe

let liste_mdp = JSON.parse(localStorage.getItem("liste_mdp")); // La liste des mots de passe
let temps = 40; // Le temps d'attendre avant de réessayer l'identification
let date = new Date(); // La date actuelle

let id_bouton_afficher_mdp; // L'id du bouton pour afficher le mot de passe



/************************************************************************************************************************************************************************/
/***************************************************************  Event Listeners  **************************************************************************************/
/************************************************************************************************************************************************************************/

document.addEventListener("deviceready", onDeviceReady); // Quand l'appareil est prêt
document.getElementById("btn_ajout_mdp").addEventListener("click", ajouter_mdp); // Quand on clique sur le bouton ajouter
document.getElementById("btn_supr_mdp").addEventListener("click", suprimer_mdp); // Quand on clique sur le bouton supprimer
document.getElementById("btn_demande_ajout_mdp").addEventListener("click", affiche_ajout); // Quand on clique sur le bouton ajouter un mdp
document.getElementById("btn_demande_supr_mdp").addEventListener("click", affiche_retirer); // Quand on clique sur le bouton supprimer un mdp
document.getElementById("btn_reassayer_identification").addEventListener("click", onDeviceReady); // Quand on clique sur le bouton réessayer l'identification



/************************************************************************************************************************************************************************/
/******************************************************************  Functions  *****************************************************************************************/
/************************************************************************************************************************************************************************/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Cordova
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function onDeviceReady() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée quand l'application reçoit le signal device ready
    Permet l'exécution de la fonction getCurrentPosition s'il y a 
    une connexion internet.
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/
    console.log("Fonction: onDeviceReady");

    sessionStorage.setItem("verrif_session", "verrif_nok"); // Initialisation de la session

    test_empreinte("onDeviceReady"); // Test de l'empreinte digitale
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Empreinte digitale
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function test_empreinte(nom_fonction) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui fais un test de l'empreinte digitale
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: test_empreinte");

    switch (nom_fonction) { // Selon la fonction appelée
        case "onDeviceReady": // Si onDeviceReady
            // Si l'empreinte digitale est disponible
            Fingerprint.show({
                title: "Acces MDP", // Le titre de la fenêtre
                description: "Pour acceder aux mdp il faut vous identifier", // La description de la fenêtre
                cancelButtonTitle: "Retour" // Le texte du bouton de retour
            }, succes_identification, err_identification_on);
            break;

        case "afficher_mdp": // Si afficher_mdp
            Fingerprint.show({
                title: "Affichage MDP",
                description: "Pour afficher le mdp il faut vous identifier",
                cancelButtonTitle: "Retour"
            }, succes_afficher_mdp, err_identification);
            break;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function succes_identification() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée si l'empreinte digitale est valide
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: succes_identification");

    ARTICLE_AFFICHE_MDP.classList.remove("cache"); // Affiche l'article des mots de passe

    if (!(ARTICLE_ERREUR.classList.contains("cache"))) { // Si l'article d'erreur est affiché
        ARTICLE_ERREUR.classList.add("cache"); // On le cache
    }

    lister_mdp(); // Affiche les mots de passe
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function succes_afficher_mdp() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée si l'empreinte digitale est valide pour afficher le mot de passe
    
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: succes_afficher_mdp");

    const MDP = dechiffrement(liste_mdp[id_bouton_afficher_mdp].mdp); // Déchiffre le mot de passe

    pop_up("Le mot de passe est: " + MDP); // Affiche le mot de passe

    if (sessionStorage.getItem("verrif_session") == "verrif_nok") { // Si la session est invalide
        sessionStorage.setItem("verrif_session", "verrif_ok"); // On met la session à valide
        date = new Date(); // On met la date actuelle pour la session
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function err_identification() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée si l'empreinte digitale est invalide
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: err_identification");

    sessionStorage.setItem("verrif_session", "verrif_nok"); // On met la session à invalide
    pop_up("Empreinte incorrecte"); // On affiche un message d'erreur

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function err_identification_on(error) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée si l'empreinte digitale est invalide
    
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: err_identification");


    if (ARTICLE_ERREUR.classList.contains("cache")) { // Si l'article d'erreur est caché
        ARTICLE_ERREUR.classList.remove("cache"); // On l'affiche
    }

    switch (error.code) {
        case -108: // clique sur le bouton annuler
            redirection()
            break;

        case -109: // clique sur le bouton annuler
            redirection()
            break;
        
        case -112: // Définitevemnt bloquer
            pop_up("Vous avez définitivement bloqué l'authentification biométrique.");
            P_ERREUR.innerHTML = "Veillez redéveruoiller votre téléphone.";
            break;

        case -104: // matériel biométrique non supportés
            pop_up("Votre appareil ne supporte pas l'authentification biométrique.");
            P_ERREUR.innerHTML = "Veuillez utiliser un appareil compatible.";
            break;

        default:
            err_identification() // On appelle la fonction err_identification pour afficher le messsage d'erreur

            P_ERREUR.innerHTML = "Erreur d'identification, veuillez réessayer plus tard.";

            BTN_REASSAYER_IDENTIFICATION.disabled = true; // On désactive le bouton

            const BOUCLE = window.setInterval(modif_seconde, 1000); // On crée une boucle pour modifier le texte du bouton

            setTimeout(arret_boucle, (temps + 2) * 1000, BOUCLE); // On arrête la boucle après un certain temps
            break;
    }

}

function redirection(){
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée si l'utilisateur annule l'authentification biométrique
    
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: modif_seconde");

    pop_up("Vous avez annulé l'authentification biométrique.");
    document.head.innerHTML = "<meta http-equiv='refresh' content='1;url=index.html'>"; // On redirige vers la page d'accueil

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function modif_seconde() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée toutes les secondes pour modifier le texte du bouton
    
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: modif_seconde");

    BTN_REASSAYER_IDENTIFICATION.innerHTML = "Réessayer dans " + temps + " secondes"; // On modifi le texte du bouton avec le nombre de seconde qui reste

    temps = temps - 1;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function arret_boucle(BOUCLE) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction appelée après un certain temps pour arrêter la boucle
    
    Paramètre entré :
        - BOUCLE : la boucle à arrêter

    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: arret_boucle");

    clearInterval(BOUCLE); // On arrète la boucle

    BTN_REASSAYER_IDENTIFICATION.innerHTML = "Réessayer"; // On met un texte fixe au boutton
    BTN_REASSAYER_IDENTIFICATION.disabled = false; // On active le bouton
    temps = 40; // On réinialise la boucle du temps

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Mot de passe
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function lister_mdp() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui affiche les mots de passe
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: lister_mdp");

    let option;

    while (TABLE_MDP.firstChild) { // Supprimer les éléments précédents du tableau
        TABLE_MDP.removeChild(TABLE_MDP.firstChild);
    }

    while (SELECT_RETIRER_MDP.firstChild) { // Supprimer les éléments précédents de la liste déroulante
        SELECT_RETIRER_MDP.removeChild(SELECT_RETIRER_MDP.firstChild);
    }

    if (liste_mdp != null && liste_mdp.length !== 0) { // Si la liste des mdp sont valide ou non vide
        // On crée le tableau des mots de passe
        let html = "<tr><th>Nom Application</th><th>Login</th><th>Mot de passe</th></tr>";
        for (let [index, mdp] of Object.entries(liste_mdp)) {
            html += "<tr><td>" + mdp.nom + "</td><td>" + mdp.login + "</td><td><button id='mdp_" + index + "' class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored'>Afficher mdp</button></td></tr>";
            // On crée la liste déroulante des mots de passe à supprimer
            option = document.createElement("option");
            option.value = index;
            option.innerHTML = mdp.nom;
            SELECT_RETIRER_MDP.append(option);
        }
        TABLE_MDP.innerHTML = html;

        // On ajoute un événement pour chaque bouton d'affichage de mot de passe
        for (let index of Object.keys(liste_mdp)) {
            document.getElementById("mdp_" + index).addEventListener("click", afficher_mdp);
        }
    } else { // Si la liste des mdp est vide
        // On affiche un message dans le tableau des mots de passe
        TABLE_MDP.innerHTML = "<tr><th>Aucun mot de passe enregistré</th></tr>";
        option = document.createElement("option");
        option.value = "none";
        option.innerHTML = "Acun mot de passe enregistré";
        SELECT_RETIRER_MDP.append(option);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function afficher_mdp(event) {

    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui affiche un mot de passe
    
    Paramètre entré :
        - e : l'événement
    
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: afficher_mdp");

    id_bouton_afficher_mdp = event.target.id.split("_")[1]; // Récupère l'id du bouton

    if (sessionStorage.getItem("verrif_session") == "verrif_ok") { // Si la session est valide
        if (new Date() - date < 30000) { // Si la date actuelle - la date de la session est inférieure à 30 secondes
            succes_afficher_mdp(); // On affiche le mot de passe
        } else {
            test_empreinte("afficher_mdp"); // Sinon on teste l'empreinte digitale
            sessionStorage.setItem("verrif_session", "verrif_nok"); // Et on met la session à invalide
        }
    } else {
        test_empreinte("afficher_mdp"); // Sinon on teste l'empreinte digitale
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function ajouter_mdp() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui ajoute un mot de passe
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: ajouter_mdp");

    // On récupère les valeurs des inputs
    const NOM = INPUT_NOM.value;
    const LOGIN = INPUT_LOGIN.value;
    const MDP = INTPUT_MDP.value;
    const VERIF_MDP = INTPUT_VERIF_MDP.value;

    if (!(NOM == "" || LOGIN == "" || MDP == "" || VERIF_MDP == "")) { // Si les champs ne sont pas vides

        if (liste_mdp != null && MDP == VERIF_MDP) { // Si la liste des mdp existe et que les mdp correspondent
            test_mdp(true, MDP, NOM, LOGIN); // On ajoute le mot de passe
        } else if (liste_mdp == null && MDP == VERIF_MDP) { // Si la liste des mdp n'existe pas et que les mdp correspondent
            test_mdp(false, MDP, NOM, LOGIN); // On ajoute le mot de passe
        } else {
            pop_up("Les mots de passe ne correspondent pas");
        }

        // On vide les inputs
        INTPUT_MDP.value = "";
        INTPUT_VERIF_MDP.value = "";
    } else (
        pop_up("Veuillez remplir tous les champs")
    )


}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function test_mdp(liste, mdp, nom, login) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui ajoute un mot de passe à la liste des 
    mots de passe ou qui crée une nouvelle liste de mot de passe 
    si elle n'existe pas.

    Paramètre entré :
        - liste : booléen qui indique si la liste existe
        - mdp : mot de passe à ajouter
        - nom : nom de l'application
        - login : login de l'application
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: test_mdp");

    mdp = chiffrement(mdp); // Chiffre le mot de passe

    if (liste) { // Si la liste existe
        liste_mdp.push({ "nom": nom, "login": login, "mdp": mdp }); // On ajoute le mot de passe

    } else {
        liste_mdp = [{ "nom": nom, "login": login, "mdp": mdp }]; // Sinon on crée une nouvelle liste de mot de passe
    }

    localStorage.setItem("liste_mdp", JSON.stringify(liste_mdp)); // On enregistre la liste des mots de passe

    pop_up("Le mot de passe a été ajouté"); // On affiche un message de confirmation

    // On vide les inputs
    INPUT_NOM.value = "";
    INPUT_LOGIN.value = "";

    lister_mdp(); // On re affiche les mots de passe avec le nouveau mot de passe
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function suprimer_mdp() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui supprime un mot de passe

    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: suprimer_mdp");

    const MDP_RETIRE = SELECT_RETIRER_MDP.value; // Récupère l'index du mot de passe à supprimers

    if (MDP_RETIRE != "none") { // Si un mot de passe est sélectionné
        liste_mdp.splice(MDP_RETIRE, 1); // On supprime le mot de passe
        pop_up("Le mot de passe de a été supprimé"); // On affiche un message de confirmation
        localStorage.setItem("liste_mdp", JSON.stringify(liste_mdp)); // On enregistre la liste des mots de passe
        lister_mdp(); // On re affiche les mots de passe

    } else {
        pop_up("Aucun mot de passe à supprimer"); // On affiche un message d'erreur
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function affiche_ajout() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui affiche le formulaire d'ajout de mot de passe

    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: affiche_ajout");

    if (ARTICLE_AJOUT_MDP.classList.contains("cache")) {
        ARTICLE_AJOUT_MDP.classList.remove("cache");
        ARTICLE_SUPR_MDP.classList.add("cache");
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function affiche_retirer() {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui affiche le formulaire de suppression de mot de passe

    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: affiche_retirer");

    if (ARTICLE_SUPR_MDP.classList.contains("cache")) {
        ARTICLE_SUPR_MDP.classList.remove("cache");
        ARTICLE_AJOUT_MDP.classList.add("cache");
    }

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Chiffrement
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function chiffrement(mdp_a_chiffrer) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui chiffre un mot de passe

    Paramètre entré :
        - mdp_a_chiffrer : mot de passe à chiffrer
	
    Retourne le mot de passe chiffré
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: chiffrement");

    /*~~~~~~~~~~~~~~~~~~~
    Détails de CryptoJS.AES.encrypt:
        - CryptoJS : bibliothèque de chiffrement
        - AES : algorithme de chiffrement utilise pour le chiffrement
        - encrypt : fonction de chiffrement
        - mdp_a_chiffrer : mot de passe à chiffrer
        - KEY : clé de chiffrement
        - toString() : convertit le mot de passe en base64 (texte)
    ~~~~~~~~~~~~~~~~~~~*/

    return CryptoJS.AES.encrypt(mdp_a_chiffrer, KEY).toString();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function dechiffrement(mdp_chiffre) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction qui déchiffre un mot de passe

    Paramètre entré :
        - mdp_chiffre : mot de passe à déchiffrer
	
    Retourne le mot de passe déchiffré
    ~~~~~~~~~~~~~~~~~~~*/

    console.log("Fonction: dechiffrement");

    /*~~~~~~~~~~~~~~~~~~~
    Détails de CryptoJS.AES.encrypt:
        - CryptoJS : bibliothèque de chiffrement
        - AES : algorithme de chiffrement utilise pour le chiffrement
        - decrypt : fonction de déchiffrement
        - mdp_chiffre : mot de passe à déchiffrer
        - KEY : clé de chiffrement
        - toString(CryptoJS.enc.Utf8) : convertit le mot de passe en UTF-8 (texte)
    ~~~~~~~~~~~~~~~~~~~*/

    return CryptoJS.AES.decrypt(mdp_chiffre, KEY).toString(CryptoJS.enc.Utf8); // Déchiffre le mot de passe et le retourne en UTF-8 (texte)

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		PopUp
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function pop_up(message_etat) {
    /*~~~~~~~~~~~~~~~~~~~
    Fonction permettant d'afficher de manière propre des informations.
	
    Paramètre entré :
        - message_etat : le message à afficher dans la pop-up
	
    Retourne rien
    ~~~~~~~~~~~~~~~~~~~*/
    console.log("Fonction: pop_up");

    componentHandler.upgradeDom(); // Force la mise à jour des composants MDL

    const DATA = { // Les données pour la notification MDL
        message: message_etat, // Le message à afficher
        actionText: '', // Le texte du bouton
        timeout: 4000 // Le temps d'affichage de la notification
    };

    NOTIF.MaterialSnackbar.showSnackbar(DATA); // Afficher la notification MDL
}

/************************************************************************************************************************************************************************/