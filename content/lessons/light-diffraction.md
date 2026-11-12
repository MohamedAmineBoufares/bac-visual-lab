---
id: light-diffraction
title: Diffraction de la lumière
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
chapter: Ondes
status: draft
version: 0.2.0
app-version: 1.0.0
author: Mohamed Amine Boufares
updated: 2026-11-12
language: fr
---

## Historique

La ligne la plus récente en premier. Elle est affichée sur la page de la leçon.

| Version | Date       | Auteur                 | Version de l’app | Modifications                                    |
| ------- | ---------- | ---------------------- | ---------------- | ------------------------------------------------ |
| 0.2.0   | 2026-11-12 | Mohamed Amine Boufares | 1.0.0            | Fiche remplie : formules, curseurs, vue 3D, quiz |

## Objectif

Quand la lumière d'un laser traverse une fente très fine, elle ne donne pas un point mais une tache centrale
large entourée de taches plus faibles : c'est la diffraction, preuve que la lumière est une onde. Plus la
fente est fine, plus la tache est large : θ = λ/a.

## Ce que l'élève règle

| Symbole | Grandeur                 | Unité | Min | Max | Pas | Valeur initiale |
| ------- | ------------------------ | ----- | --- | --- | --- | --------------- |
| λ       | Longueur d'onde du laser | nm    | 400 | 750 | 1   | 633             |
| a       | Largeur de la fente      | µm    | 20  | 200 | 1   | 100             |
| D       | Distance fente – écran   | m     | 0,5 | 3   | 0,1 | 2               |

## Ce que l'élève voit

- La figure de diffraction sur l'écran (bandes claires et sombres), avec la largeur L de la tache centrale
  marquée par une double flèche et écrite.
- La courbe d'intensité I(x) le long de l'écran (trait plein), les zéros marqués par des croix.
- Le nom de la couleur et la valeur de λ écrits (la couleur n'est jamais la seule information).
- Un graphique L en fonction de 1/a : une droite, qui montre la proportionnalité.

## Vue 3D

Le banc d'optique : laser, plaque à fente, écran. Vu de dessus, le même banc, avec le faisceau qui s'ouvre
d'un angle 2θ après la fente.

| Objet          | Forme                           | Change avec                           | Ce que ça montre                                     |
| -------------- | ------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| Laser          | Boîtier cylindrique             | λ : couleur du faisceau et étiquette  | La source monochromatique                            |
| Plaque à fente | Plaque avec une fente verticale | a : fente plus ou moins large         | L'obstacle qui diffracte                             |
| Faisceau       | Cône transparent après la fente | Demi-angle θ = λ/a                    | La lumière s'étale après la fente                    |
| Écran          | Plaque blanche avec les taches  | Taches de largeur 2λD/a, horizontales | Une fente verticale étale la lumière horizontalement |
| Règle          | Règle graduée sur l'écran       | Mesure L                              | La mesure faite en TP                                |

Pendant l'animation :

- En réduisant a, le cône s'ouvre et la tache centrale s'élargit.
- En reculant l'écran (D plus grand), la tache s'agrandit dans la même proportion.

## Formules

$$
\theta \approx \tan\theta = \frac{\lambda}{a} \qquad L = 2D\tan\theta \approx \frac{2\lambda D}{a}
$$

$$
I(x) = I_0\left(\frac{\sin\beta}{\beta}\right)^2 \qquad \beta = \frac{\pi a\,x}{\lambda D}
$$

Les zéros sont à x = kλD/a (k entier non nul). L'approximation des petits angles est valable ici
(θ < 0,04 rad). Termes liés aux curseurs : λ, a, D.

## Valeurs de référence

Avec λ = 633 nm, a = 100 µm, D = 2 m :

| Situation           | Résultat attendu             |
| ------------------- | ---------------------------- |
| Écart angulaire     | θ = 6,33 × 10⁻³ rad          |
| Largeur de la tache | L = 25,32 mm                 |
| a = 200 µm          | L = 12,66 mm (divisée par 2) |
| λ = 450 nm          | L = 18,0 mm                  |
| D = 1 m             | L = 12,66 mm                 |
| x = 0               | I = I₀                       |
| x = λD/a            | I = 0 (premier zéro)         |

## Étapes commentées

L'élève fait varier a.

1. **Fente large** (a ≥ 150 µm) : la tache est étroite, presque un point ; la diffraction est faible.
2. **On rétrécit la fente** (60 à 150 µm) : la tache centrale s'élargit, les taches secondaires
   apparaissent.
3. **Fente fine** (a < 60 µm) : la tache est large ; la lumière ne se propage plus en ligne droite.
4. **Changer la couleur** : le bleu (λ petit) donne une tache plus étroite que le rouge.
5. **Mesurer λ** : en mesurant L, D et a, on retrouve λ = aL/(2D).

## Erreurs fréquentes des élèves

- Croire qu'une fente plus large donne une tache plus large (c'est l'inverse).
- Oublier que la tache centrale est deux fois plus large que les taches secondaires.
- Mélanger les unités (nm, µm, mm) dans L = 2λD/a.
- Penser que la figure est parallèle à la fente (elle est perpendiculaire).

## Quiz

1. Si on divise a par 2, que devient L ?
   - Elle est divisée par 2
   - Elle double **(bonne réponse)**
   - Elle ne change pas
   - _Explication :_ L = 2λD/a est inversement proportionnelle à a.
2. Quel laser donne la tache centrale la plus large (même fente) ?
   - Bleu (450 nm)
   - Rouge (650 nm) **(bonne réponse)**
   - Ils donnent la même
   - _Explication :_ L est proportionnelle à λ, plus grande pour le rouge.
3. La diffraction montre que la lumière :
   - Est formée de particules qui rebondissent
   - Se comporte comme une onde **(bonne réponse)**
   - Se propage toujours en ligne droite
   - _Explication :_ Seule une onde s'étale ainsi après une ouverture de taille proche de λ.

## Remarques

Un fil fin donne la même figure qu'une fente de même largeur (théorème de Babinet) : utile pour mesurer le
diamètre d'un cheveu, une manipulation connue partout. Le modèle ne gère que la fente simple ; les
interférences (fentes d'Young) pourront être une autre leçon.
