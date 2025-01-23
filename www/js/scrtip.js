/************************************************************************************************************************************************************************/
/***************************************************************  Variables globales  ***********************************************************************************/
/************************************************************************************************************************************************************************/
const ARTICLE_CHARGEMENT = document.getElementById("chargement"); // L'élément de chargement
const PROGRESS_DEMMANDE = document.getElementById("progress_demande"); // La barre de progression
const UL_AVANCEMENT_DEMANDE = document.getElementById("ul_avancement_demande"); // La liste des étapes de la demande

const ARTICLE_INFO_AVION = document.getElementById("avion"); // L'élément où il y a l'ensemble des infos des avions
const DIV_AVION = document.getElementById("liste_avion"); // L'élément où on affiche les infos des avions
const P_INFO_AVION = document.getElementById("info_avion"); // L'élément où on affiche les infos des avions

const ARTICLE_INFO_VILLE = document.getElementById("ville"); // L'élément où on affiche les infos de la ville
const SELECT_UTILISATEUR_VILLE = document.getElementById("select_utilisateur_ville"); // La liste des villes
const SELECT_UTILISATEUR_PAYS = document.getElementById("select_utilisateur_pays"); // La liste des pays

const ARTICLE_ERREUR = document.getElementById("erreur"); // L'élément où on affiche les erreurs
const P_INFO_ERREUR = document.getElementById("info_erreur"); // L'élément où on affiche les erreurs
const BUTTON_ERREUR = document.getElementById("input_erreur"); // Le bouton pour accéder aux paramètres
const BUTTON_RECHARGEMENT = document.getElementById("input_recharger") // Le bouton pour recharger la page

const ARTICLE_LOCAL = document.getElementById("local"); // L'éllément des fonctions locales
const BTN_DESA_FLASH_QR = document.getElementById("btn_desa_flash_qr"); // Le bouton pour activer/désactiver la lampe torche
const BTN_ACT_FLASH_QR = document.getElementById("btn_act_flash_qr"); // Le bouton pour activer/désactiver la lampe torche

const SECTION_INFO_VILLE_AVION = document.getElementById("info_ville_avion"); // La section où on affiche les infos de la ville et des avions
const SECTION_INFO_MAP = document.getElementById("info_map"); // La section où on affiche la map
const SECTION_QR = document.getElementById("qr"); // La section pour le QR code

const CHARGEMENT_LOC = document.getElementById("chargement_loc"); // L'élément de chargement de la localisation

const NOTIF = document.querySelector('.mdl-js-snackbar'); // La notification

let ville_nom, texte_qr; // Les variables pour les infos des villes et le nom de la ville


/************************************************************************************************************************************************************************/
/*******************************************************  Création de la map et de ses paramètre  ***********************************************************************/
/************************************************************************************************************************************************************************/

const MAP = L.map('map').setView([0, 0], 1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(MAP);
MAP.setMaxZoom(12);
MAP.setMinZoom(8);
var ico_avion = L.icon({
	iconUrl: '../img/leaflet/ico_avion.png',
	iconSize: [20, 20] // Taille de l'icone
});

/************************************************************************************************************************************************************************/
/***************************************************************  Event Listeners  **************************************************************************************/
/************************************************************************************************************************************************************************/

document.addEventListener("deviceready", onDeviceReady); // Quand l'appareil est prêt
document.addEventListener("pause", onPause); // Quand l'application est en pause
document.addEventListener("resume", onResume); // Quand l'application est en marche
document.addEventListener("backbutton", onBackButton); // Quand on appuie sur le bouton retour
document.addEventListener("online", mise_ligne); // Quand l'appareil est en ligne
document.addEventListener("offline", mise_horsligne); // Quand l'appareil est hors ligne
document.getElementById("btn_affiche_avion").addEventListener("click", affiche_carte); // Quand on clique sur le bouton pour afficher les avions
document.getElementById("partage_info").addEventListener("click", partage_info); // Quand on clique sur le bouton pour partager les infos
document.getElementById('btn_qr').addEventListener("click", start_qr); // Quand on clique sur le bouton pour scanner un QR code 
document.getElementById("btn_stop_qr").addEventListener("click", stop_qr); // Quand on clique sur le bouton pour arrêter le scanner QR Code
document.getElementById("btn_erreur_qr").addEventListener("click", erreur_qr); // Quand on clique sur le bouton pour afficher un message d'erreur
document.getElementById("enregistre_info").addEventListener("click", enregistre_pdf_info); // Quand on clique sur le bouton pour enregistrer les infos
SELECT_UTILISATEUR_VILLE.addEventListener("change", utilisateur_ville); // Quand on change la ville on affiche les avions
SELECT_UTILISATEUR_PAYS.addEventListener("change", changement_pays); // Quand on change le pays on charge les villes
BUTTON_ERREUR.addEventListener("click", acces_parametre); // Quand on clique sur le bouton d'erreur on accède aux paramètres
BUTTON_RECHARGEMENT.addEventListener("click", onDeviceReady); // Quand on clique sur le bouton de rechargement on recharge la page
BTN_ACT_FLASH_QR.addEventListener("click", flash_act_qr); // Quand on clique sur le bouton pour activer la lampe torche
BTN_DESA_FLASH_QR.addEventListener("click", flash_desa_qr); // Quand on clique sur le bouton pour désactiver la lampe torche

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

	if (!(ARTICLE_ERREUR.classList.contains("cache"))) { // Si on a un message d'erreur on le cache
		ARTICLE_ERREUR.classList.add("cache");
		document.getElementById("chargement_loc").classList.remove('cache'); // On affiche le chargement de la localisation
	}

	if (navigator.connection.type != "none") { // Si on a une connexion internet on fait appel à la géolocalisation
		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
	} else {
		pop_up("Vous n'avez pas de connexion internet");
	}

	if (!(localStorage.getItem("ville_liste"))) { // Si on n'a pas les infos de toutes les villes
		get("./assets/liste_villes.json", "ville_liste");
	} else {
		afficher_pays();
	}

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function onPause() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'application reçoit le signal pause
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: onPause");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function onResume() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'application reçoit le signal resume
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: onResume");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function onBackButton() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'application reçoit le signal back button
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: onBackButton");

	if (!(SECTION_INFO_MAP.classList.contains("cache"))) { // Si on est sur la map on revient sur les infos de la ville

		navigator.vibrate(100);

		SECTION_INFO_MAP.classList.add("cache");
		SECTION_INFO_VILLE_AVION.classList.remove("cache");
	} else if (!(SECTION_QR.classList.contains("cache"))) { // Si on est sur le QR code on revient sur les infos de la ville

		navigator.vibrate(100);

		stop_qr();
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		GeoLoc
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function geolocationSuccess(position) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand la géolocalisation est un succès.
	Après avoir récupéré la localisation, on fait appel à la fonction get
	pour savoir quelle est la ville où l'on se trouve.

	Paramètre entré :
		- position : toutes les données de la position

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: geolocationSuccess");

	// On récupère la ville où l'on se trouve
	get("https://api.opencagedata.com/geocode/v1/json?q=" + position.coords.latitude + "%2C" + position.coords.longitude + "&key=cfc05245add24186bbe869a5ed1ad49f", "trouver_ville");

	document.getElementById("chargement_loc").classList.add('cache'); // On cache le chargement de la localisation
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function geolocationError() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand il y a une erreur de géolocalisation.
	Cette fonction renvoie l'erreur et enlève la possibilité de refaire une demande.
	
	Paramètre entré :
		- error : les données de l'erreur
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: geolocationError");

	// On affiche un message d'erreur
	P_INFO_ERREUR.innerHTML = "L'application n'a pas pu accéder à la localisation. Vérifier si elle est bien active ou si l'application a les droits. Si c'est déjà le cas, merci de vous mettre où la localisation est possible de se faire.";

	if (BUTTON_ERREUR.classList.contains("wifi")) { // On change le bouton pour accéder aux paramètres de localisation
		BUTTON_ERREUR.classList.remove("wifi");
	}
	BUTTON_ERREUR.classList.add("localisation");

	if (ARTICLE_ERREUR.classList.contains("cache")) { // On affiche le message d'erreur
		ARTICLE_ERREUR.classList.remove("cache");
	}

	if (ARTICLE_LOCAL.classList.contains("cache")) {
		ARTICLE_LOCAL.classList.remove("cache")
	}

	if (!(ARTICLE_INFO_AVION.classList.contains("cache"))) { // On cache les infos des avions
		ARTICLE_INFO_AVION.classList.add("cache");
		ARTICLE_INFO_VILLE.classList.add("cache");
	}

	document.getElementById("chargement_loc").classList.add('cache'); // On cache le chargement de la localisation

	if (BUTTON_RECHARGEMENT.classList.contains('cache')) { // On affiche le bouton pour recharger la page
		BUTTON_RECHARGEMENT.classList.remove('cache');
	}

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Demande API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function get(url, fonction) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant de faire une demande GET à des APIs
	
	Paramètre entré :
		- url : l'URL de la requête
		- fonction : la fonction qui a appelé la requête
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: get");


	if (navigator.connection.type != "none") {
		const XHR = new XMLHttpRequest();
		XHR.fonction = fonction;
		XHR.onreadystatechange = statechange;
		XHR.open("GET", url);
		XHR.send();
	} else {
		let msg = "Vous n'avez pas de connexion internet";
		pop_up(msg);
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function statechange(event) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée à chaque fois que la requête change d'état.
	Cette fonction permet d'exécuter des fonctions par rapport à la requête effectuée.
	
	Paramètre entré :
		- event : les données de la requête
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: statechange");

	const XHR = event.target;

	switch (XHR.readyState) {
		case 1: chargement_info(1); break; // La requête est en cours de préparation
		case 2: chargement_info(2); break;  // La requête a été reçue
		case 3: chargement_info(3); break; // La requête est en cours de traitement
		case 4: // La réponse a été reçue

			chargement_info(4);

			if (XHR.status === 200) { // Si tout s'est bien passé
				chargement_info(5);

				const REPONSE = XHR.responseText;
				const REPONSE_JSON = JSON.parse(REPONSE); // On transforme la réponse en objet

				switch (XHR.fonction) {
					case "ville_liste":
						localStorage.setItem("ville_liste", REPONSE);
						afficher_pays();
						break;
					case "trouver_ville": // Si on a demandé la ville de la localisation GPS
						ville_nom = REPONSE_JSON.results[0].components._normalized_city;
						pop_up(REPONSE_JSON.results[0].formatted);
						demande_ville();
						break;

					case "localisation_ville": // Si on a demandé les infos de localisation de la ville
						pop_up(REPONSE_JSON.results[0].formatted);
						localStorage.setItem(ville_nom, REPONSE);
						info_avion();
						break;

					case "info_avion": // Si on a demandé les infos de l'avion
						localStorage.setItem("info_avion", JSON.stringify(REPONSE_JSON.states));
						affiche_avion();
						break;
				}
				chargement_info(6);
			} else {
				P_INFO_ERREUR.innerHTML = "Erreur de communication aevc le serveur. Vérifier votre connexion internet et réessayer plus tard.";
				ARTICLE_CHARGEMENT.classList.add("cache"); // On cache le chargement

				if (BUTTON_ERREUR.classList.contains("localisation")) { // On change le bouton pour accéder aux paramètres du wifi
					BUTTON_ERREUR.classList.remove("localisation");
				}
				BUTTON_ERREUR.classList.add("wifi");

				if (ARTICLE_ERREUR.classList.contains("cache")) { // On affiche le message d'erreur
					ARTICLE_ERREUR.classList.remove("cache");
				}

				if (BUTTON_RECHARGEMENT.classList.contains('cache')) { // On affiche le bouton pour recharger la page
					BUTTON_RECHARGEMENT.classList.remove('cache');
				}
			}
			break;
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function chargement_info(etape) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'afficher les étapes de chargement de la requête en cours.

	Paramètre entré :
		- etape : l'étape de la requête en cours

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: chargement_info");

	const LI = document.createElement("li");

	let texte;

	switch (etape) { // Selon l'étape de la requête
		case 1: // La requête est en cours de préparation
			if (!(ARTICLE_INFO_AVION.classList.contains("cache"))) { // Si on a déjà des infos sur les avions on les cache
				ARTICLE_INFO_AVION.classList.add("cache");
				ARTICLE_INFO_VILLE.classList.add("cache");
			}
			while (UL_AVANCEMENT_DEMANDE.firstChild) { // Supprimer les éléments précédents de la liste des étapes
				UL_AVANCEMENT_DEMANDE.removeChild(UL_AVANCEMENT_DEMANDE.firstChild);
			}
			texte = "Requête est en cours de préparation"
			ARTICLE_CHARGEMENT.classList.remove("cache");
			break;
		case 2: texte = "Requête reçue"; break; // La requête a été reçue
		case 3: texte = "Requête en cours de traitement"; break; // La requête est en cours de traitement
		case 4: texte = "Requête terminée et réponse prête"; break; // La réponse a été reçue
		case 5: texte = "Traitement local de la réponse"; break; // Traitement local de la réponse
		case 6: // La requête est terminée
			texte = "Traitement local terminé";
			ARTICLE_CHARGEMENT.classList.add("cache");
			break;

	}
	PROGRESS_DEMMANDE.value = etape;
	LI.innerHTML = texte;
	UL_AVANCEMENT_DEMANDE.append(LI)
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Ville
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function demande_ville() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant de demander les infos de la ville
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: demande_ville");

	if (localStorage.getItem(ville_nom)) { // Si on a déjà demandé les infos de la ville
		info_avion(ville_nom);
	} else { // Sinon on demande les infos de la ville
		get("https://api.opencagedata.com/geocode/v1/json?q=" + ville_nom + "&key=toadd", "localisation_ville");
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function utilisateur_ville() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'utilisateur a fait une demande pour une ville précise.
	Cette fonction va cacher le formulaire de demande et récupère le nom de la ville
	pour ensuite appeler la fonction demande_ville.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: utilisateur_ville");

	ville_nom = SELECT_UTILISATEUR_VILLE.value;

	if (ville_nom != "none") {
		if (!(ARTICLE_INFO_AVION.classList.contains("cache"))) {
			ARTICLE_INFO_AVION.classList.add("cache"); // Faire disparaître les infos des avions
			ARTICLE_INFO_VILLE.classList.add("cache"); // Faire disparaître le formulaire pour entrer une ville
		}

		demande_ville();
	} else {
		pop_up("Aucune ville n'a été séléctionnner");
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Avion
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function info_avion() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant de demander les infos des avions se trouvant audessus la ville choisie par l'utilisateur.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: info_avion");

	const INFO_VILLE = JSON.parse(localStorage.getItem(ville_nom)); // Récupération des infos de la ville dans le stockage local

	// Extraction et extention des limites
	const COMMUN = INFO_VILLE.results[0].bounds;
	const LATITUDE_MAX = parseFloat(COMMUN.northeast.lat) + 0.1;
	const LATITUDE_MIN = parseFloat(COMMUN.southwest.lat) - 0.1;
	const LONGITUDE_MAX = parseFloat(COMMUN.northeast.lng) + 0.1;
	const LONGITUDE_MIN = parseFloat(COMMUN.southwest.lng) - 0.1;

	for (let [index, nom] of Object.entries(MAP._layers)) { // Pour toute les couche existance 
		if (index != 25) { // Si ce n'est pas la couche de la map
			MAP.removeLayer(nom); // On la supprime
		}
	}

	const BOUNDS = L.latLngBounds([[LATITUDE_MIN, LONGITUDE_MIN], [LATITUDE_MAX, LONGITUDE_MAX]]); // Création des limites

	L.rectangle(BOUNDS, { color: "#ff7800", weight: 1 }).addTo(MAP); // Ajout d'un rectangle qui represente la zone
	MAP.setZoom(1);
	MAP.setMaxBounds(BOUNDS); // Fixation des limites sur la map

	get("https://opensky-network.org/api/states/all?lamin=" + LATITUDE_MIN + "&lomin=" + LONGITUDE_MIN + "&lamax=" + LATITUDE_MAX + "&lomax=" + LONGITUDE_MAX, "info_avion");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function affiche_avion() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'afficher les infos des avions au-dessus de la ville choisie.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: affiche_avion");

	const INFO_AVION = JSON.parse(localStorage.getItem("info_avion")); // Va chercher dans le local storage les infos des avions
	const LISTE_NOM_INDEX = { 0: "Adresse unique", 2: "Pays d'origine", 5: "Longitude", 6: "Latitude", 7: "Altitude", 9: "Vitesse" }; // Dictionnaire des index des infos et leurs noms pour les différents avions

	let i = 1;
	let li, p, ul;

	while (DIV_AVION.firstChild) { // Supprimer les éléments précédents
		DIV_AVION.removeChild(DIV_AVION.firstChild);
	}

	switch (INFO_AVION) { // Selon les infos des avions
		case null: // S'il n'y a pas d'avion au-dessus de la ville choisie
			P_INFO_AVION.innerHTML = "Il n'y a pas d'avions au-dessus de " + ville_nom + ".";
			break;

		default: // Sinon on affiche les informations des avions
			P_INFO_AVION.innerHTML = "Il y a actuellement " + INFO_AVION.length + " avions au-dessus de " + ville_nom + ".";

			for (let avion of INFO_AVION) { // Pour chaque avion
				p = document.createElement("p");
				ul = document.createElement("ul");
				div = document.createElement("div");

				// On crée les éléments HTML pour afficher les informations de l'avion
				div.classList.add("mdl-card");
				div.classList.add("mdl-shadow--2dp");
				p.innerHTML = "Avion " + i; // Pour compter les avions
				p.classList.add("p_avion");

				for (let [index, nom] of Object.entries(LISTE_NOM_INDEX)) { // Pour chaque type d'information
					if (avion[index] != null) { // Si la valeur n'est pas null
						li = document.createElement("li");
						li.innerHTML = "<span class='souligner'>" + nom + "</span> : " + avion[index]; // Afficher les informations de l'avion
						ul.append(li);
					}
				}

				div.append(p);
				div.append(ul);

				DIV_AVION.append(div);

				i++;
			}
			break;
	}
	if (ARTICLE_INFO_AVION.classList.contains("cache")) {  // Si on a caché les infos des avions on les affiche
		ARTICLE_INFO_AVION.classList.remove("cache");
		ARTICLE_INFO_VILLE.classList.remove("cache");
		ARTICLE_LOCAL.classList.remove("cache");
	}

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		MAP
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function affiche_carte() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'afficher la carte de la ville avec les avions

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: affiche_carte");

	const INFO_AVION = JSON.parse(localStorage.getItem("info_avion")); // Va chercher dans le local storage les infos des avions

	let i = 0;

	navigator.vibrate(100);

	SECTION_INFO_VILLE_AVION.classList.add("cache"); // On cache les infos de la ville et des avions

	SECTION_INFO_MAP.classList.remove("cache"); // On affiche la map

	MAP.invalidateSize(); // Permet de recharger la map si elle a été modifiée

	if (INFO_AVION != null) { // Si il y a des avions
		let latlng;
		for (let avion of INFO_AVION) { // Pour chaque avion
			latlng = [avion[6], avion[5]]; // On récupère les coordonnées
			L.marker(latlng, { icon: ico_avion, title: "oui" + i }).addTo(MAP); // On ajoute un marker sur la map
		}
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		PDF
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function enregistre_pdf_info() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'enregistrer en pdf les informations afficher sur le téléphone.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: enregistre_pdf_info");

	const date = new Date().toISOString().slice(0, 10); // Récupérer la date actuelle en format yyyy-mm-dd
	const jsPDF = window.jspdf.jsPDF; // Créer un objet jsPDF
	const doc = new jsPDF(); // Créer un document jsPDF

	doc.html(liste_avion_html(), { // Convertir le HTML en PDF
		callback: function (doc) { // Quand le PDF est prêt

			const pdfOutput = doc.output("blob");// Convertir le PDF en blob

			// Écrire le fichier PDF
			window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) { // Récupérer le répertoire externe du téléphone
				dirEntry.getFile("Download/" + ville_nom + "_avion_" + date + ".pdf", { create: true }, function (fileEntry) { // Créer le fichier PDF avec le nom de la ville et la date
					fileEntry.createWriter(function (fileWriter) { // Créer le writer pour écrire le fichier PDF
						fileWriter.onwriteend = function () { // Quand l'écriture est terminée
							pop_up("PDF enregistré avec succès");
						};

						fileWriter.onerror = function (e) { // S'il y a une erreur lors de l'écriture
							console.error("Erreur lors de l'écriture du fichier : " + e.toString());
						};

						fileWriter.write(pdfOutput); // Écrire le fichier PDF
					});
				});
			});
		},
		x: 10, // Position en x sur le PDF
		y: 10 // Position en y sur le PDF
	});

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Partage
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function partage_info() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant de partager les info afficher sur le téléphone.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: partage_info");

	// Partager les informations des avions sur les réseaux sociaux avec le plugin SocialSharing
	window.plugins.socialsharing.share(
		'Je te partage des info pertinente que j\'ai trouver sur les avion au dessus de la ville de ' + ville_nom + '.\n' + liste_avion_html(),
		'Partage Info avion');
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function liste_avion_html() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant de retourner la liste des avion en format texte pour le partage
    
	Retourne le texte a ajouter
	~~~~~~~~~~~~~~~~~~~*/
	let texte = "";

	for (let texte_div of DIV_AVION.children) {
		// Remplacer les balises HTML par des espaces ou des sauts de ligne appropriés
		let cleanText = texte_div.innerHTML
			.replace(/<br\s*\/?>/gi, "\n") // Remplacer les balises <br> par des sauts de ligne ("\s*\/?" pour prendre en compte les balises <br> et <br/>)
			.replace(/<\/?span[^>]*>/gi, "") // Supprimer les balises <span> (\/? pour prendre en compte les balises <span> et </span>,"[^>]*" pour prendre en compte les attributs)
			.replace(/<\/?li[^>]*>/gi, "\n"); // Remplacer les balises <li> par des sauts de ligne ("\s*\/?" pour prendre en compte les balises <li> et <li/>)
		texte += cleanText + "\n";
	}

	return texte;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Input Ville/Pays
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function afficher_pays() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on a les infos des villes et qu'on veut afficher les pays dans la liste déroulante.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: afficher_pays");

	let option;

	let ville_liste = JSON.parse(localStorage.getItem("ville_liste")); // Récupération des infos des villes

	for (let pays of Object.keys(ville_liste)) { // Pour chaque pays dans la liste des villes on l'ajoute dans la liste déroulante
		option = document.createElement("option");
		option.value = pays;
		option.innerHTML = pays;
		SELECT_UTILISATEUR_PAYS.append(option);
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function changement_pays() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on change le pays dans la liste déroulante.
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: changement_pays");

	let ville_liste = JSON.parse(localStorage.getItem("ville_liste"));

	let option;

	if (SELECT_UTILISATEUR_PAYS.value != "none") { // Si on a choisi un pays on affiche les villes

		if (SELECT_UTILISATEUR_VILLE.classList.contains("cache")) { // Si la liste des villes est cachée on l'affiche
			SELECT_UTILISATEUR_VILLE.classList.remove("cache");
			document.getElementById("label_utilisateur_ville").classList.remove("cache");
		}

		while (SELECT_UTILISATEUR_VILLE.firstChild) { // Supprimer les éléments précédents
			SELECT_UTILISATEUR_VILLE.removeChild(SELECT_UTILISATEUR_VILLE.firstChild);
		}

		option = document.createElement("option");
		option.value = "none";
		option.innerHTML = "-Pas séléctionner-";
		SELECT_UTILISATEUR_VILLE.append(option);

		for (let ville of ville_liste[SELECT_UTILISATEUR_PAYS.value]) { // Pour chaque ville dans le pays choisi on l'ajoute dans la liste déroulante
			option = document.createElement("option");
			option.value = ville;
			option.innerHTML = ville;
			SELECT_UTILISATEUR_VILLE.append(option);
		}
	} else { // Si on n'a pas choisi de pays on cache les villes
		if (!(SELECT_UTILISATEUR_VILLE.classList.contains("cache"))) {
			SELECT_UTILISATEUR_VILLE.classList.add("cache");
			document.getElementById("label_utilisateur_ville").classList.add("cache");
		}
	}

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function pop_up_qr(message_etat) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'afficher de manière propre des informations.
	
	Paramètre entré :
		- message_etat : le message à afficher dans la pop-up
		- texte_copie : le texte à copier
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: pop_up_qr");

	componentHandler.upgradeDom(); // Force la mise à jour des composants MDL

	const DATA = { // Les données pour la notification MDL
		message: message_etat, // Le message à afficher
		actionHandler: copie_texte, // L'action à effectuer
		actionText: 'Copier le texte', // Le texte du bouton
		timeout: 4000 // Le temps d'affichage de la notification
	};

	NOTIF.MaterialSnackbar.showSnackbar(DATA); // Afficher la notification MDL
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function copie_texte() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appeler quand on clique sur le bouton pour copier le texte
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: copie_texte");

	cordova.plugins.clipboard.copy(texte_qr); // Copier le texte
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Paramètre
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function acces_parametre() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction permettant d'acceder au parametre de l'application
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log("Fonction: acces_parametre");

	if (BUTTON_ERREUR.classList.contains("wifi")) { // Si on a une erreur de connexion internet
		window.cordova.plugins.settings.open("wifi", param_succes, param_err); // Ouvrir les paramètres du wifi
	} else if (BUTTON_ERREUR.classList.contains("localisation")) { // Si on a une erreur de localisation
		cordova.plugins.diagnostic.isLocationEnabled(loc_succes, loc_err); // Vérifier si la localisation est activée
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loc_succes(statut) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appeler quand la localisation est activée ou non
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	if (statut) { // Si la localisation est activée
		window.cordova.plugins.settings.open("application_details", param_succes, param_err); // Ouvrir les paramètres de l'application
	} else {
		window.cordova.plugins.settings.open("location", param_succes, param_err); // Ouvrir les paramètres de la localisation
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loc_err(error) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appeler quand il y a une erreur lors de la vérification des services de localisation
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.error("Erreur lors de la vérification des services de localisation: " + error);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function param_succes() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appeler quand les paramètres sont ouverts
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log('Ouverture des paramètre');
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function param_err() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appeler quand il y a une erreur lors de l'ouverture des paramètres
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/
	console.log('Ouverture imposible des paramètre');
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		Mise en ligne
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function mise_ligne() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'application détecte que l'appareil est en ligne
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: mise_ligne");

	if (!(ARTICLE_ERREUR.classList.contains("cache"))) { // Si on a un message d'erreur on le cache
		ARTICLE_ERREUR.classList.add("cache")
		ARTICLE_INFO_VILLE.classList.remove("cache");

		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }); // On fait appel à la géolocalisation
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function mise_horsligne() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand l'application détecte que l'appareil est hors ligne
	
	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: mise_horsligne");

	P_INFO_ERREUR.innerHTML = "Vous n'êtes pas connecter a internet, merci de vous connecter a un réseau."; // On affiche un message d'erreur

	if (ARTICLE_LOCAL.classList.contains("cache")) { // Si on a caché les fonctions de locale on les affiche
		ARTICLE_LOCAL.classList.remove("cache");
	}

	if (BUTTON_ERREUR.classList.contains("localisation")) { // On change le bouton pour accéder aux paramètres de connexion
		BUTTON_ERREUR.classList.remove("localisation");
	}
	BUTTON_ERREUR.classList.add("wifi");

	if (ARTICLE_ERREUR.classList.contains("cache")) { // On affiche le message d'erreur
		ARTICLE_ERREUR.classList.remove("cache");
		ARTICLE_INFO_VILLE.classList.add("cache");
	}

	if (!(CHARGEMENT_LOC.classList.contains("cache"))) { // Si on a le chargement de la localisation on le cache
		CHARGEMENT_LOC.classList.add('cache');
	}

	if (!(SECTION_INFO_MAP.classList.contains("cache"))) { // Si on est sur la map on revient sur les infos de la ville
		SECTION_INFO_MAP.classList.add("cache");
		SECTION_INFO_VILLE_AVION.classList.remove("cache");
	}

	if (!(SECTION_QR.classList.contains("cache"))) { // Si on est sur le QR Code on revient sur les infos de la ville
		stop_qr()
	}

	if (!(BUTTON_RECHARGEMENT.classList.contains('cache'))) { // On cache le bouton pour recharger la page
		BUTTON_RECHARGEMENT.classList.add('cache');
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//																		QrCode
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function start_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on clique sur le bouton pour scanner un QR code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: start_qr");

	navigator.vibrate(100);

	SECTION_INFO_VILLE_AVION.classList.add("cache"); // On cache les infos de la ville et des avions
	SECTION_QR.classList.remove("cache"); // On cache la section QR Code

	if (BTN_ACT_FLASH_QR.classList.contains("cache")) { // Si la lampe torche est désactivée
		BTN_ACT_FLASH_QR.classList.remove("cache"); // On affiche le bouton pour activer la lampe torche
		BTN_DESA_FLASH_QR.classList.add("cache"); // On cache le bouton pour désactiver la lampe torche
	}

	QRScanner.prepare(prepare_qr); // Préparer le scanner QR Code
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function prepare_qr(err) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on prépare le scanner QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: prepare_qr");

	if (err) { // S'il y a une erreur lors de la préparation
		document.getElementById("erreur_qr").classList.remove("cache"); // Afficher un message d'erreur
		document.getElementById("info_qr").classList.add("cache"); // Afficher un message d'erreur

	} else { // S'il n'y a pas d'erreur
		QRScanner.show(retour_qr); // Afficher la caméra
		QRScanner.scan(scan_qr); // Scanner le QR Code
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function scan_qr(scan_err, texte) {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on scanne un QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: scan_qr");

	navigator.vibrate(100);

	texte_qr = texte;

	if (scan_err) {
		console.log("Erreur lors du scan : ", scan_err);
	} else {
		pop_up_qr('Le QR Code contient : ' + texte_qr);
	}

	stop_qr();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function stop_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on scanne un QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: stop_qr");

	QRScanner.disableLight(); // Désactiver la lampe torche

	QRScanner.destroy(); // Détruire le scanner

	document.getElementById("body_index").style = "none"; // On enlève le style pour le body

	SECTION_INFO_VILLE_AVION.classList.remove("cache"); // On affiche les infos de la ville et des avions
	SECTION_QR.classList.add("cache"); // On cache la section QR Code

	if (BTN_ACT_FLASH_QR.classList.contains("cache")) { // Si la lampe torche est désactivée
		BTN_ACT_FLASH_QR.classList.remove("cache"); // On affiche le bouton pour activer la lampe torche
		BTN_DESA_FLASH_QR.classList.add("cache"); // On cache le bouton pour désactiver la lampe torche
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function flash_act_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on clique sur le bouton pour activer la lampe torche

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: flash_act_qr");

	QRScanner.enableLight();

	BTN_ACT_FLASH_QR.classList.add("cache");
	BTN_DESA_FLASH_QR.classList.remove("cache");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function flash_desa_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on clique sur le bouton pour arrêter le scanner QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: flash_desa_qr");

	QRScanner.disableLight();

	BTN_ACT_FLASH_QR.classList.remove("cache");
	BTN_DESA_FLASH_QR.classList.add("cache");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function retour_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on scanne un QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: callback");

	console.log("OK");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function erreur_qr() {
	/*~~~~~~~~~~~~~~~~~~~
	Fonction appelée quand on scanne un QR Code

	Retourne rien
	~~~~~~~~~~~~~~~~~~~*/

	console.log("Fonction: erreur_qr");

	window.cordova.plugins.settings.open("application_details", param_succes, param_err);

}
/************************************************************************************************************************************************************************/