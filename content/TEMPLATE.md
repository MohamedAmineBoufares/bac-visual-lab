---
id: identifiant-du-chapitre
title: Titre de la leçon
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
chapter: Nom du chapitre
status: draft
version: 0.1.0
app-version: 1.1.0
author: Votre nom
updated: 2026-01-31
language: fr
---

<!--
Chaque chapitre a déjà sa fiche dans content/lessons/<id>.md, créée à partir de ce modèle : remplissez-la.
Copiez ce fichier seulement pour un nouveau chapitre. Les parties marquées (obligatoire) doivent être remplies.

En-tête :
- id : l'identifiant du chapitre dans src/lessons/lessons.ts (ex. rl-circuit). C'est aussi le nom du fichier.
- subject : physics, chemistry ou math.
- sections : les sections du Bac concernées, séparées par des virgules :
  sciences-experimentales, mathematiques, sciences-techniques, informatique.
- status : todo (fiche vide), draft (proposition), accepted (validée par le mainteneur), built (simulation en ligne).
- version : la version de CETTE FICHE (pas de l'application). Elle commence à 0.1.0 et augmente à chaque
  modification de la fiche : 1.0.0 → 1.1.0 pour un ajout, → 1.0.1 pour une correction.
- app-version : la version de l'APPLICATION (celle du pied de page, dans package.json) dans laquelle cette
  modification sera visible. Laissez la valeur proposée en cas de doute : le mainteneur l'ajuste.
- author, updated : l'auteur et la date (AAAA-MM-JJ) de la dernière modification.
  Ils doivent être identiques à la première ligne de l'historique.

Le contenu doit être original : ne copiez pas de texte ou de figures des manuels du CNP.
-->

## Historique

La ligne la plus récente en premier. Elle est affichée sur la page de la leçon.

| Version | Date       | Auteur    | Version de l’app | Modifications        |
| ------- | ---------- | --------- | ---------------- | -------------------- |
| 0.1.0   | 2026-01-31 | Votre nom | 1.1.0            | Première proposition |

## Objectif (obligatoire)

L'idée principale que l'élève doit retenir, en une ou deux phrases.

## Ce que l'élève règle (obligatoire)

Un curseur par grandeur.

| Symbole | Grandeur | Unité | Min | Max | Pas | Valeur initiale |
| ------- | -------- | ----- | --- | --- | --- | --------------- |
|         |          |       |     |     |     |                 |

## Ce que l'élève voit

Les courbes, l'animation ou le schéma, et ce qui change quand on bouge un curseur.

## Vue 3D

Facultatif. Le montage en 3D que l'élève peut faire tourner, à côté de la formule, et le même montage vu
de dessus en schéma, où chaque objet se remplit avec sa grandeur. Un objet par ligne, son nom sert d'étiquette :
sa forme, ce qui le fait changer (un curseur ou le temps) et ce que l'élève doit comprendre en le voyant.
Ne comptez pas sur la couleur seule : forme, taille ou mouvement doivent suffire.

| Objet | Forme | Change avec | Ce que ça montre |
| ----- | ----- | ----------- | ---------------- |
|       |       |             |                  |

Pendant l'animation :

-

## Formules (obligatoire)

En TeX, entre `$$`. Indiquez quels termes dépendent d'un curseur.

$$
$$

## Valeurs de référence (obligatoire)

Des résultats exacts et vérifiables : ils deviennent des tests automatiques de la simulation.

| Situation | Résultat attendu |
| --------- | ---------------- |
|           |                  |

## Étapes commentées

Les moments importants de l'évolution, avec l'explication à afficher à l'élève à chaque étape.

1. **Titre** : explication.

## Erreurs fréquentes des élèves

-

## Quiz

3 à 5 questions. Marquez la bonne réponse par **(bonne réponse)**.

1. Question ?
   - Réponse A
   - Réponse B **(bonne réponse)**
   - Réponse C
   - _Explication :_ …

## Remarques

Tout ce qui aide : niveau de détail, ordre dans le programme, liens vers des ressources libres.
