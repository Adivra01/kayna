# Refonte complète UNLIVED — cahier des charges v2

## Objectif
Transformer le site KAYNA actuel en boutique **UNLIVED · UNTIL YOU DECIDE**, conçue mobile d’abord pour le Royaume-Uni, en anglais et en GBP, sans supprimer ni désactiver la musique existante.

## Ce qui sera refait

### 1. Identité et fondations visuelles
- Remplacer l’identité KAYNA visible par UNLIVED sur l’ensemble de la boutique publique.
- Appliquer strictement la palette du document : blanc cassé dominant, os, nuit, bordeaux et laiton.
- Utiliser Fredoka, des angles droits, aucune ombre et une grille maximale de 1280 px.
- Conserver la musique actuelle, son fichier audio, son état global et son contrôle persistant.

### 2. Accueil court et orienté conversion
- Navigation fixe : Story, Training, Circle, bouton Shop, panier et menu mobile.
- Héros plein écran avec vidéo existante comme contenu provisoire, poster immédiat, titre « There’s a life you haven’t lived. », CTA Shop et signature « Until you decide ».
- Section collection avec exactement deux références de lancement et bascule face/dos accessible.
- Bande bordeaux « You’re not buying clothing » présentant garment, training et circle.
- Section nuit « No one is coming. » avec capture email et consentement UK GDPR.
- Pied de page clair en cinq colonnes selon le cahier.

### 3. Boutique et pages produit
- Refaire `/shop` autour des deux t-shirts de lancement, avec une grille extensible.
- Ajouter les URLs prévues `/shop/oversize-tee-black` et `/shop/oversize-tee-bone`, tout en gardant la compatibilité avec les liens produit existants.
- Refaire la fiche produit : galerie, zoom, tailles S–XXL, guide des tailles, accordéons, confiance achat et suggestion de l’autre pièce.
- Rendre le choix d’une formation obligatoire avant l’ajout au panier.
- Afficher la formation dans le panier comme ligne à £0 et conserver une formation par pièce.

### 4. Pages et parcours publics
- Créer `/story` avec le manifeste en anglais et sa rupture bordeaux.
- Créer `/training`, `/circle`, `/shipping`, `/returns`, `/size-guide`, `/contact` et `/cookies`.
- Adapter la confirmation de commande pour prioriser l’accès à la formation et le cercle.
- Supprimer de la navigation publique les pages non prévues au lancement, sans casser l’administration, l’authentification et les données existantes.

### 5. Langue, devise, conformité et référencement
- Passer toute la boutique publique en anglais uniquement et en GBP.
- Adapter les mentions à la livraison UK, au droit de rétractation de 14 jours, à l’UK GDPR et au consentement cookies.
- Retirer toute promesse de revenu garanti des formations.
- Mettre à jour titres, descriptions, données Product, sitemap, robots et textes alternatifs pour UNLIVED.

### 6. Performance et accessibilité
- Servir le héros avec poster et repli statique, charger le reste en différé.
- Limiter les animations à l’inventaire du cahier et respecter la réduction des mouvements.
- Garantir navigation clavier, focus visible, contrastes AA et adaptation mobile prioritaire.
- Corriger les erreurs de compilation existantes rencontrées dans l’administration.

## Contenus provisoires et limites
- Le cahier indique que les deux vidéos finales du héros, les visuels produit complets, les prix finaux, les programmes et certains textes légaux ne sont pas encore fournis.
- La refonte utilisera les médias et données déjà présents comme placeholders clairement remplaçables, sans inventer de promesse commerciale.
- L’application reste sur son socle React/Vite actuel pour préserver le backend et les fonctions existantes ; l’apparence et les parcours suivront le cahier.

## Vérification
- Tester les vues mobile et bureau de l’accueil, de la collection, d’une fiche produit et du panier.
- Vérifier que le choix de formation bloque correctement l’ajout tant qu’il manque.
- Vérifier que le son joue toujours via le même contrôle.
- Contrôler erreurs console, compilation, liens, métadonnées et absence de débordements.
