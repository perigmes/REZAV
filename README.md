# REZAV

## Description

REZAV est une application de gestion de réservations du matériel audiovisuel du BUT MMI de l'IUT de LAVAL. Elle permet aux élèves de réserver du matériel et d'en faire la demande à M. Houlière. Celui-ci acceptera ou refusera la demande soumise à l'élève.

## Fonctionnalités

- Consultation le materiel disponibleaux date données
- Réservation de materiel
- Gestion des réservations (modification, refus,acceptation)
- Modification du materiel disponible
- Consultation des réservations passées

## Technologies utilisées

- Front-end : React.js, Scss
- Back-end : Node.js, Express.js
- Base de données : MongoDB
- Autres outils : Git, Docker.

### Prérequis
- Node.js (v20.11.1)

## Installation
1. Clonez le dépôt :
    ```bash
    git clone https://github.com/votre-utilisateur/rezav.git
    ```
2. Accédez au répertoire du projet :
    ```bash
    cd rezav
    ```
3. Installez les dépendances :
    ```bash
    npm install
    ```

## Utilisation

1. Démarrez l'application :
    ```bash
    npm start
    ```
2. Ouvrez votre navigateur et accédez à `http://localhost:3000 pour le front`

3. Ouvrez votre navigateur et accédez à `http://locaolhost:5000 pour le back`

4. Se connecter à la VM distante en faisant un tunnel pour avoir accès à la base de données
    ```ssh
     ssh etudiant@172.18.68.101 -L 27018:localhost:27017
     ```
    lancer la VM: 
    docker compose exec -ti reserver mongo -u etudiant -p SAE501

## Contribuer

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements que vous souhaitez apporter.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteurs

- **Clémentine Prouteau** - *Développeur principal* - [perigmes](https://github.com/perigmes)
- **Pierrick Breaud** - *Développeur principal* - [Pierrickbrd](https://github.com/Pierrickbrd)
- **Charlie Charron** - *Développeur principal* - [Charlie](https://github.com/qw6d3)
- **Thomas Blanchard** - *Développeur principal* - [Blathox](https://github.com/Blathox)

