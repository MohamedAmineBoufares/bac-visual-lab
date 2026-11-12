---
id: mechanical-waves
title: Ondes mécaniques progressives
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

Une onde transporte une perturbation sans transporter de matière. Le long d'une corde excitée par une source
sinusoïdale, chaque point reproduit le mouvement de la source avec un retard θ = x/v. L'onde est périodique
dans le temps (période T) et dans l'espace (longueur d'onde λ = vT).

## Ce que l'élève règle

| Symbole | Grandeur               | Unité | Min | Max | Pas  | Valeur initiale |
| ------- | ---------------------- | ----- | --- | --- | ---- | --------------- |
| N       | Fréquence de la source | Hz    | 10  | 100 | 1    | 50              |
| v       | Célérité de l'onde     | m/s   | 1   | 20  | 0,5  | 10              |
| a       | Amplitude de la source | mm    | 1   | 10  | 0,5  | 5               |
| x_M     | Position du point M    | m     | 0   | 1   | 0,01 | 0,3             |

Un bouton choisit « Corde (transversale) » ou « Ressort (longitudinale) ». Le temps démarre quand la source
commence à vibrer ; la corde est supposée infinie (pas de réflexion).

## Ce que l'élève voit

- L'aspect de la corde à l'instant t, y(x) (trait plein), avec λ marquée par une double flèche.
- Le diagramme du mouvement de la source y_S(t) (trait plein) et du point M y_M(t) (pointillés), avec le
  retard θ marqué.
- L'état de M écrit : « au repos », « en phase avec S », « en opposition de phase », ou le déphasage.
- Un mode « stroboscope » qui fige l'onde quand la fréquence des éclairs vaut N.

## Vue 3D

La corde tendue entre un vibreur et un amortisseur, vue en perspective. Vu de dessus, la même corde en
profil, M marqué par un point plein.

| Objet              | Forme                                      | Change avec                          | Ce que ça montre                                   |
| ------------------ | ------------------------------------------ | ------------------------------------ | -------------------------------------------------- |
| Vibreur (source S) | Lame qui monte et descend                  | N et a                               | La source impose fréquence et amplitude            |
| Corde              | Tube fin qui ondule                        | y(x, t)                              | La forme sinusoïdale se déplace                    |
| Point M            | Petite sphère sur la corde                 | x_M ; ne bouge que verticalement     | Les points de la corde ne voyagent pas avec l'onde |
| Front d'onde       | Petit drapeau au bout de la partie touchée | Avance à la vitesse v                | La perturbation se propage                         |
| Règle λ            | Règle graduée posée sous la corde          | λ = v/N : s'allonge ou se raccourcit | La périodicité spatiale                            |

Pendant l'animation :

- Le drapeau avance à vitesse constante ; M reste immobile tant que le front ne l'a pas atteint.
- Ensuite M monte et descend sur place, avec le même mouvement que S, en retard.

## Formules

$$
y_S(t) = a\sin(2\pi N t) \qquad \lambda = vT = \frac{v}{N} \qquad \theta = \frac{x}{v}
$$

$$
y_M(t) = \begin{cases} 0 & t < \theta \\ a\sin\left(2\pi N t - \frac{2\pi x_M}{\lambda}\right) & t \ge \theta \end{cases}
\qquad \Delta\varphi = \frac{2\pi x_M}{\lambda}
$$

M vibre en phase avec S si x_M = kλ, en opposition de phase si x_M = (2k + 1)λ/2 (k entier). Termes liés aux
curseurs : N, v, a, x_M.

## Valeurs de référence

Avec N = 50 Hz, v = 10 m/s, a = 5 mm :

| Situation       | Résultat attendu                          |
| --------------- | ----------------------------------------- |
| Période         | T = 20 ms                                 |
| Longueur d'onde | λ = 0,2 m                                 |
| x_M = 0,3 m     | θ = 30 ms ; Δφ = 3π : opposition de phase |
| x_M = 0,4 m     | en phase avec S (x_M = 2λ)                |
| t < θ           | y_M = 0                                   |
| N = 100 Hz      | λ = 0,1 m (v inchangée)                   |

## Étapes commentées

Les étapes dépendent de t/θ, puis du déphasage de M.

1. **La source démarre** (t < θ) : seule la partie proche de S bouge ; M est au repos.
2. **Le front atteint M** (t = θ) : M commence à reproduire le mouvement de S.
3. **Régime établi** (t > θ) : toute la corde jusqu'à M ondule ; la forme se répète tous les λ.
4. **Comparer S et M** : selon x_M, M est en phase ou en opposition de phase avec S.
5. **Stroboscope** : à la bonne fréquence d'éclairs, la corde paraît immobile ; on y mesure λ.

## Erreurs fréquentes des élèves

- Croire que la matière avance avec l'onde (les points vibrent sur place).
- Penser que v dépend de la fréquence ou de l'amplitude (elle dépend du milieu).
- Confondre période temporelle T et période spatiale λ.
- Confondre déplacement du point (vitesse de vibration) et célérité de l'onde.

## Quiz

1. Si on double N (même corde), que devient λ ?
   - Elle double
   - Elle est divisée par 2 **(bonne réponse)**
   - Elle ne change pas
   - _Explication :_ v dépend du milieu, pas de N ; λ = v/N est divisée par 2.
2. Un point de la corde, au passage de l'onde :
   - Avance avec l'onde
   - Vibre sur place **(bonne réponse)**
   - Reste immobile
   - _Explication :_ L'onde transporte de l'énergie, pas de matière.
3. Un point situé à 3λ/2 de la source vibre :
   - En phase avec la source
   - En opposition de phase **(bonne réponse)**
   - En quadrature
   - _Explication :_ Δφ = 2π·(3λ/2)/λ = 3π, un nombre impair de π.
4. Le son dans l'air est une onde :
   - Transversale
   - Longitudinale **(bonne réponse)**
   - Électromagnétique
   - _Explication :_ Les tranches d'air vibrent dans la direction de propagation.

## Remarques

Le mode « Ressort » montre des spires qui se serrent et s'écartent (onde longitudinale), avec les mêmes
formules. Les ondes à la surface de l'eau (cuve à ondes, cercles concentriques) pourront être une vue 3D
supplémentaire.
