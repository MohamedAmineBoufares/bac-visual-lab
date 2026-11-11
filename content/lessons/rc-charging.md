---
id: rc-charging
title: Charge d'un condensateur
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
chapter: Dipôle RC
status: built
version: 1.0.0
target-version: 0.1.0
author: Mohamed Amine Boufares
updated: 2026-11-11
language: fr
---

## Historique

La ligne la plus récente en premier. Elle est affichée sur la page de la leçon.

| Version | Date       | Auteur                 | Version cible | Modifications                                        |
| ------- | ---------- | ---------------------- | ------------- | ---------------------------------------------------- |
| 1.0.0   | 2026-11-11 | Mohamed Amine Boufares | 0.1.0         | Fiche écrite à partir de la simulation déjà en ligne |

## Objectif

Voir comment la tension aux bornes d'un condensateur monte pendant la charge à travers une résistance, et
savoir lire la constante de temps τ = RC sur la courbe.

## Ce que l'élève règle

| Symbole | Grandeur              | Unité | Min | Max | Pas | Valeur initiale |
| ------- | --------------------- | ----- | --- | --- | --- | --------------- |
| E       | Tension du générateur | V     | 1   | 12  | 0,5 | 5               |
| R       | Résistance            | kΩ    | 0,5 | 5   | 0,1 | 2,2             |
| C       | Capacité              | µF    | 0,5 | 2   | 0,1 | 1               |

Le temps va de 0 à 20 ms. L'élève peut lancer, mettre en pause, ralentir (×0,25, ×0,5, ×1) et déplacer le
curseur du temps à la main.

## Ce que l'élève voit

- Les courbes u_C(t) (trait plein) et u_R(t) (pointillés) sur le même graphique.
- Un repère à t = τ et la valeur de u_C à l'instant courant.
- La formule de u_C, où E et RC s'allument quand on bouge leur curseur.
- En mode « avec interprétation », l'animation s'arrête à chaque étape ci-dessous et affiche l'explication.

## Formules

$$
u_C(t) = E\left(1 - e^{-t/RC}\right) \qquad u_R(t) = E - u_C(t) \qquad \tau = RC
$$

Avec R en kΩ et C en µF, τ est directement en ms. Termes liés aux curseurs : E et RC.

## Valeurs de référence

Avec E = 5 V, R = 2 kΩ, C = 1,5 µF :

| Situation          | Résultat attendu                |
| ------------------ | ------------------------------- |
| Constante de temps | τ = 3 ms                        |
| t = 0              | u_C = 0                         |
| t = τ              | u_C = E(1 − e⁻¹) ≈ 63,2 % de E  |
| t = 5τ             | u_C > 99,3 % de E               |
| Tout instant       | u_C + u_R = E (loi des mailles) |

## Étapes commentées

Les étapes dépendent de t/τ.

1. **Le condensateur est vide** (t/τ < 0,15) : u_C = 0, toute la tension E est aux bornes de R. Le courant
   est maximal, la charge démarre vite.
2. **Charge rapide** (0,15 à 0,85) : u_C monte vite et u_R baisse d'autant, u_C + u_R = E à chaque instant.
3. **t = τ : 63 % de E** (0,85 à 1,25) : après une constante de temps, u_C vaut 63 % de E. C'est ainsi
   qu'on lit τ sur une courbe.
4. **La charge ralentit** (1,25 à 5) : plus le condensateur est chargé, plus le courant faiblit, la courbe
   s'aplatit.
5. **Régime permanent** (t/τ ≥ 5) : u_C ≈ E (plus de 99 %) et le courant est nul.

## Erreurs fréquentes des élèves

- Croire que doubler R accélère la charge (τ = RC augmente, la charge ralentit).
- Confondre 63 % (charge à t = τ) et 37 % (ce qui reste à charger, ou la décharge à t = τ).
- Penser que le condensateur est « plein » dès t = τ.

## Quiz

1. Si on double R, que devient τ ?
   - τ est divisé par 2
   - τ double **(bonne réponse)**
   - τ ne change pas
   - _Explication :_ τ = RC est proportionnelle à R : doubler R double τ, la charge est deux fois plus lente.
2. À t = τ, quelle fraction de E vaut u_C ?
   - Environ 37 %
   - Environ 63 % **(bonne réponse)**
   - 100 %
   - _Explication :_ u_C(τ) = E(1 − e⁻¹) ≈ 0,63 E : le condensateur a atteint 63 % de sa tension finale.
3. Au bout de combien de temps considère-t-on le condensateur chargé ?
   - τ
   - 2τ
   - 5τ **(bonne réponse)**
   - _Explication :_ À t = 5τ, u_C ≈ 99 % de E : on considère la charge terminée.

## Remarques

Code : `src/sims/rc-charging/` (modèle, tests, simulation, quiz). La décharge pourra faire l'objet d'une
fiche séparée ou d'un mode supplémentaire.
