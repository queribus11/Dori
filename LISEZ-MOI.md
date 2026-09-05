# Dori – installer l'app sur votre iPhone

*Dori est le nouveau nom de Focus (même app, mêmes fichiers). Votre adresse : https://queribus11.github.io/dori/*

Il faut publier ces fichiers sur une adresse web (gratuit, une seule fois), puis ajouter la page à l'écran d'accueil de l'iPhone. Ensuite l'app fonctionne plein écran, avec son icône, même sans réseau.

## 1. Créer un compte GitHub (2 min)

1. Sur votre Mac, ouvrez https://github.com/signup et créez un compte (adresse e-mail, mot de passe, nom d'utilisateur — par exemple `sophiepicard`).
2. Validez l'e-mail de confirmation.

## 2. Créer le dépôt et déposer les fichiers (3 min)

1. Une fois connectée, cliquez sur le bouton vert **New** (ou allez sur https://github.com/new).
2. Repository name : `dori` · laissez **Public** coché · cliquez **Create repository**.
3. Sur la page qui s'ouvre, cliquez sur le lien **uploading an existing file**.
4. Glissez-déposez tous les fichiers de ce dossier (`index.html`, `parser.js`, `theme.css`, `sw.js`, `manifest.webmanifest`, les trois `icon-*.png`) puis, dans un second envoi, le dossier `fonts/` (GitHub accepte le glisser-déposer d'un dossier) dans la zone, puis cliquez **Commit changes** en bas.

## 3. Activer l'hébergement (1 min)

1. Dans le dépôt, onglet **Settings** (en haut), puis **Pages** dans le menu de gauche.
2. Sous *Build and deployment* → *Branch* : choisissez **main**, laissez `/ (root)`, cliquez **Save**.
3. Attendez environ une minute, rechargez la page : une adresse apparaît, de la forme
   `https://queribus11.github.io/dori/`

## 4. Sur l'iPhone (1 min)

1. Ouvrez cette adresse dans **Safari** (obligatoirement Safari, pas Chrome).
2. Appuyez sur le bouton **Partager** (le carré avec la flèche), puis **Sur l'écran d'accueil**, puis **Ajouter**.
3. Lancez « Dori » depuis l'écran d'accueil : plein écran, sans barre de navigateur.

## Mettre à jour l'app plus tard

Quand vous recevez une nouvelle version : dans le dépôt GitHub, cliquez sur `index.html` → icône crayon (ou **Add file → Upload files** pour remplacer) → validez. Sur l'iPhone, fermez et rouvrez l'app : la nouvelle version se charge dès qu'il y a du réseau.

## Vos données

Les tâches sont stockées uniquement sur votre iPhone (jamais envoyées nulle part). Pensez à faire **Réglages → Exporter** de temps en temps : le fichier se range dans Fichiers/iCloud et peut être réimporté sur un autre appareil ou après un changement de téléphone.

## Version 7 — la mémoire

Le cœur de cette version : ce que vous notez **revient tout seul**.

- **Plus de date par défaut.** Une phrase sans date reste « notée », où que vous la saisissiez. Dori pose alors une seule question sous la barre : *« quand te le rappeler ? »* — Aujourd'hui, Demain, Cette semaine, ou Un jour.
- **« Noté, sans date »** : une section repliée en bas d'Aujourd'hui rassemble tout ce qui n'a pas de date. Plus rien ne disparaît dans « Toutes ».
- **« Tu avais noté… »** : chaque jour, en tête d'Aujourd'hui, une carte ressort la note la plus ancienne sans date (ou la tâche la plus reportée), avec Aujourd'hui / Autre date… / Supprimer ; la croix la remet à demain.
- **Le Tri du matin s'ouvre tous les jours** (dès qu'il y a quelque chose de prévu), retard ou pas : les tâches en retard une par une, puis une seule carte « Voilà ta journée… ça tient ? ».
- **Répétitions réelles** : « chaque vendredi », « tous les 15 du mois », « chaque premier lundi du mois », « tous les 2 jours », « chaque matin »… La tâche est datée à la prochaine occurrence et, quand vous la terminez, la suivante se crée toute seule (annulable). Vos anciennes tâches « (chaque vendredi) » sont converties.
- **Sujets à la dictée, sans arobase** : le nom d'un sujet existant suffit, même en deux mots (« tondre la pelouse maison samedi », « projet X/EB rédiger l'EB », « @projet x » = Projet X). L'arobase reste utile pour créer un sujet (@Nouveau_sujet).
- Dates comprises en plus : « avant fin novembre », « mi-octobre », « début mars », « la semaine du 21 », « à la rentrée », « penser au… ». Un samedi, « lundi prochain » veut bien dire lundi.

Et le ménage décidé avec vous : plus de pastilles Tout / Pro / Perso (les pastilles de sujets restent), plus de « + » flottant dans la Matrice, plus de lien « Fiche… », plus de réglages en chiffres (urgence automatique à 2 jours, terminées gardées 90 jours), plus de bandeau d'export (un rappel discret dans Réglages), plus de règle « - » dans les notes, plus de compteur « reporté ×N », plus de champ Sous-rubrique dans la fiche (la rubrique vient de la dictée « Sujet/Rubrique » ou du « + » de chaque rubrique). La Matrice garde son onglet.

Consolidation (audit du conseil) : un sujet archivé ne reste plus filtre et ses tâches ne rouvrent plus le Tri ni le badge ; badge exact ; « @maison » retrouve « Maison » ; renommer un sujet vers un nom existant fusionne (couleur de la cible gardée) ; dans un sujet, le « + » de chaque rubrique remplace le sélecteur « Prochaine tâche » et un chevron « ‹ Sujets » ramène en arrière ; l'app s'ouvre depuis le cache (instantané), puis se met à jour en silence.

Fichiers à remplacer : `index.html`, `parser.js`, `theme.css`, `sw.js`, `manifest.webmanifest`.

## Version 6.1 — priorités lisibles

Les quatre priorités portent désormais les mots des cases : **Prioritaire** (Important + Urgent), **Important**, **Urgent**, et **Affaires courantes** (aucune case cochée). Une tâche d'affaires courantes ne porte plus d'étiquette sur sa carte : seules les tâches marquées ressortent. La Matrice et le sélecteur d'appui long utilisent les mêmes noms.

## Version 6 — sujets et sous-rubriques

Les tâches se rangent par **sujet** (Maison, Famille, Projet X…), chacun avec sa couleur et son contexte Pro ou Perso, et par **sous-rubrique** facultative (Maison › Jardin, Projet X › EB). Dictez « @Maison/Jardin tondre samedi » ou « @ProjetX/EB rédiger l'EB avant vendredi » : un sujet ou une rubrique inconnus sont créés à la volée (ajoutez « perso » pour classer un nouveau sujet en Perso ; un nom en deux mots s'écrit avec un tiret bas : @Projet_X). Nouvel onglet **Sujets** : les sujets par Perso / Pro avec leurs compteurs et leurs rubriques ; un tap ouvre le sujet, avec ses tâches par rubrique en sections repliables (l'app se souvient de ce que vous avez replié), un sélecteur « Prochaine tâche : … » qui indique où ira ce que vous saisissez (et permet de créer une rubrique), et un bouton **Modifier** pour renommer, changer la couleur ou le contexte, ou archiver un projet clos (masqué, tâches conservées). La Matrice garde son onglet. Pro / Perso ne se coche plus sur les tâches : c'est le sujet qui le porte ; les tâches sans sujet apparaissent dans les deux filtres. Vos anciens « clients » sont devenus des sujets automatiquement.

Fichiers à remplacer : `index.html`, `parser.js`, `theme.css`, `sw.js`.

## Version 5 — recentrage

Dori est un backlog très amélioré : noter ou dicter tout ce qu'il y a à faire, pro ou perso, et se le voir rappeler. Tout ce qui ne servait pas ce but a été retiré : la jauge « N h planifiées », les durées estimées, la capacité par jour, le temps passé et le relevé mensuel. L'heure reste pour les rendez-vous (section « À heure fixe »). Nouveau : un **badge sur l'icône** de l'app (retards, tâches du jour, échéances, relances) et une section **« Cette semaine »** en bas d'Aujourd'hui pour voir venir. Sur l'iPhone, le badge s'affiche après avoir autorisé les notifications de Dori une fois (Réglages iPhone → Notifications → Dori → Pastilles).

Fichiers à remplacer : `index.html`, `theme.css`, `sw.js`.

## Nouveautés de la version 4.1 — consolidation

Suite à l'audit du conseil : l'appui long ne touche plus à l'échéance (une tâche à rendre dans deux jours reste urgente, l'app le dit) ; « Annuler » ne défait plus que l'action concernée (une modification faite entre-temps est conservée) ; un appui long interrompt le glissement en cours ; un fichier importé aux réglages invalides est corrigé au lieu d'afficher « NaN » ; le mode hors ligne survit à un fichier manquant. Lisibilité, sans changer aucune couleur : texte quasi-noir sur les étiquettes corail, citron, jaune et bleu ciel ; bandeau « à trier » et sélecteur d'appui long en texte encre avec pastille de couleur ; dépassement de capacité en corail. Polices : 489 Ko → 39 Ko (Space Grotesk en sous-ensemble, texte courant en police système). Analyseur : « fin de la semaine prochaine », « avant la fin du mois prochain », « le 15 du mois prochain », « le mardi d'après / en huit », « à 5h » (= 17 h), « 3h du matin », « appel de 20 minutes », « une heure trente », « 2 journées », « relancer lundi / le 12 », « chaque vendredi » (non daté, gardé dans le titre).

Fichiers à remplacer : `index.html`, `parser.js`, `theme.css`, `sw.js`, et le dossier `fonts/` (un seul fichier désormais : supprimez `Inter.woff2` et `SpaceGrotesk.ttf` du dépôt).

## Nouveautés de la version 4 — nouvelle apparence

Direction « Affiche » avec la palette choisie : encre kaki sombre (#3B3F2A), corail pour Prioritaire, citron vert pour À planifier, jaune soleil pour Expédier, denim pour Optionnel, bleu ciel pour l'attente, kaki du logo Azimut pour les clients. Cartes à contour d'encre sans ombre, case à cocher carrée dans la couleur du quadrant, jauge sur bloc plein, typographie Space Grotesk + Inter (embarquées, aucune connexion nécessaire), nouveaux pictogrammes et nouvelle icône d'app. Les interrupteurs de la fiche sont désormais Important = citron vert, Urgent = corail. Le mode sombre est assorti.

Nouveau geste : **appui long** sur une tâche (dans les listes ou la Matrice) → un sélecteur en quatre cases pour changer sa priorité, plus « En attente d'un tiers », sans ouvrir la fiche ; annulable dans le toast.

Fichiers à déposer dans le dépôt (nouveaux ou modifiés) : `index.html`, `theme.css`, `sw.js`, `manifest.webmanifest`, les trois `icon-*.png`, et le dossier `fonts/` (deux fichiers). Le fichier `theme-C4-alternative.css` est la palette bleu nuit gardée en réserve : pour l'essayer, renommez-le `theme.css`.

## Nouveautés de la version 3.1

Retours d'une revue UX : « Plus tard » sur le Tri du matin ne le rouvre plus à chaque lancement (le point rouge et la bannière restent) ; « Fait » et « Supprimer » dans le Tri sont annulables ; « Préparer demain » ne propose plus « Garder aujourd'hui » et se termine par un mini-bilan de la journée ; les tâches revenues d'attente ont leur section « Relances » ; un glissement ne reporte jamais une tâche après son échéance ; la carte de charge est repliée en une ligne (tap pour détailler) ; les noms des quadrants sont les mêmes partout ; la taille du texte suit le réglage de l'iPhone.

## Nouveautés de la version 3

L'app distingue désormais **« À rendre le »** (l'échéance, qui ne bouge jamais) de **« Je m'y mets le »** (le jour de travail, reportable). Une tâche devient automatiquement urgente à 2 jours de son échéance (réglable). Le **client** se rattache en écrivant `@Dupont` dans la phrase ; il devient un filtre en haut des listes et alimente le **relevé du mois** (Réglages), avec le temps estimé et le temps passé. Une tâche peut être mise **« En attente de… »** (retour client, document) avec une date de relance : elle sort de votre journée et revient toute seule le jour dit.

Le report automatique a disparu : le matin, s'il reste des tâches en retard, Dori ouvre un **Tri** qui les présente une par une (aujourd'hui, demain, autre date, fait, en attente, supprimer) en montrant la charge du jour se remplir. Le bouton **« Préparer demain »** fait la même chose le soir pour ce qui reste. Sur les listes, **glisser une tâche vers la droite** la termine, **vers la gauche** la reporte à demain ; chaque action peut être annulée dans les 5 secondes.

Côté données : une copie de la sauvegarde précédente est conservée à chaque enregistrement, une sauvegarde illisible est mise de côté au lieu d'être écrasée, et un rappel vous propose d'exporter quand le dernier export date de plus d'une semaine. L'export passe par la feuille de partage de l'iPhone (Fichiers, iCloud, Mail…).

Mise à jour depuis la v1 ou la v2 : remplacez `index.html`, `sw.js` et ajoutez `parser.js` dans le dépôt GitHub. Vos tâches sont conservées et converties automatiquement.

## Dicter une tâche

Dans Dori, la barre « Dicter ou écrire une tâche… » comprend le français : « appeler Paul demain à 14h pendant 1h », « rédiger courrier à l'avocat avant semaine prochaine », « rdv dentiste perso vendredi », « mails fournisseurs 30 min urgent »… Un aperçu s'affiche sous le champ avant de valider. Le bouton micro lance la dictée ; s'il ne répond pas, le micro du clavier de l'iPhone fait la même chose.

### Raccourci Siri « Nouvelle tâche Dori » (facultatif)

Permet de dire « Dis Siri, nouvelle tâche Dori », de dicter la phrase, et de la retrouver dans l'app. Point important : sur iPhone, une adresse web ouverte par Raccourcis s'ouvre **toujours dans Safari**, jamais dans l'app Dori de l'écran d'accueil (qui a son propre stockage). La méthode fiable passe donc par le presse-papiers. Dans l'app **Raccourcis** :

1. **+** → nommez le raccourci `Nouvelle tâche Dori` (c'est la phrase à dire à Siri).
2. Ajoutez l'action **Dicter du texte** (langue : Français ; arrêt : après une pause).
3. Ajoutez l'action **Copier dans le presse-papiers** (avec la variable *Texte dicté*).
4. Ajoutez l'action **Ouvrir l'app** et choisissez **Dori** (les apps de l'écran d'accueil sont proposées dans la liste sur les iOS récents ; si Dori n'y est pas, remplacez par **Ouvrir des URL** avec `https://queribus11.github.io/dori/`).
5. Fin. Testez : « Dis Siri, nouvelle tâche Dori » → dictez → Dori s'ouvre → appuyez sur le bouton **coller** de la barre de saisie : la phrase s'interprète, un aperçu s'affiche, validez. La première fois, l'iPhone demande « Autoriser le collage ? » : oui.

Si vous préférez essayer l'ouverture directe (**Ouvrir des URL** avec `https://queribus11.github.io/dori/?add=` suivi de *Texte dicté*), sachez que la phrase arrivera dans Safari : Dori l'y garde dans un bandeau « Dictée reçue dans Safari » avec un bouton **Copier** jusqu'à ce que vous l'ayez collée dans l'app ou ignorée. Rien n'est perdu, mais c'est un aller-retour de plus.

**Automatisation du soir (18 h)** : dans Raccourcis → Automatisation → **Heure de la journée** 18:00, chaque jour, « Exécuter immédiatement » → action **Ouvrir l'app** → Dori. Le bouton « Préparer demain » est en haut d'Aujourd'hui. L'automatisation ne se lance que téléphone déverrouillé : ajoutez au besoin un rappel Rappels à 18 h 05 en filet.

**Badge sur l'icône** : allez une fois dans Réglages → « Badge sur l'icône » → **Activer** et acceptez la demande d'autorisation. Sans cette étape, iOS n'affiche jamais le badge d'une app web.

## Version 7.1 — corrections des testeurs

Suite à l'audit du conseil et aux tests de trois utilisateurs assidus de Notes, Rappels et Raccourcis. Répétitions : une répétition avec heure (« chaque vendredi point équipe à 9h ») est datée au prochain vendredi et non aujourd'hui ; « Fait » dans le Tri crée aussi l'occurrence suivante ; rouvrir une tâche répétée retire la suivante ; « sport lundi et mercredi 19h » et « tous les jours ouvrés » sont des répétitions. Siri : la phrase arrivée dans Safari est conservée dans un bandeau jusqu'à action (plus effacée), une adresse mal encodée ne bloque plus le démarrage, le Tri ne s'ouvre pas par-dessus une dictée, plusieurs lignes collées ou dictées font plusieurs tâches. Mémoire : la carte « Tu avais noté… » ignore ce qui a été noté il y a moins d'un jour et se tait pendant la question « quand ? » ; la croix et « Un jour » l'écartent sept jours ; la question tient sur une ligne (Aujourd'hui / Demain / le jour de la semaine obtenu / ×) et s'efface à la saisie suivante. Phrases : un sujet cité comme mot ordinaire n'est reconnu qu'en tête de phrase, après « pour / sur / dans / côté » ou en dernier mot sans article (« appeler la banque » reste « Appeler la banque ») ; un sujet nommé Boulot, Pro ou Perso n'est plus pris pour un mot-clé ; virgules, deux-points et liens restent dans le titre ; la création d'un sujet annonce Pro ou Perso. Aussi : bouton « Activer le badge » dans Réglages ; le report garde l'heure ; « jeudi 10h à 12h », « 14h-15h30 », « dans 1h », « dans 30 minutes », « rappelle-moi à 15h » compris ; « Sans sujet » montre ses tâches ; « Préparer demain » une seule fois (en haut d'Aujourd'hui) ; le Tri s'appelle « Ta journée » après midi.

Fichiers à remplacer : `index.html`, `parser.js`, `sw.js`.
