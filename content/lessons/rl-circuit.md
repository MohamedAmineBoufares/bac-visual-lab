---
id: rl-circuit
title: Dipôle RL
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
chapter: Électricité
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

Voir qu'une bobine s'oppose aux variations du courant : à la fermeture, le courant ne saute pas à E/R mais
s'établit progressivement, avec une constante de temps τ = L/R que l'on lit sur la courbe.

## Ce que l'élève règle

| Symbole | Grandeur                     | Unité | Min | Max | Pas  | Valeur initiale |
| ------- | ---------------------------- | ----- | --- | --- | ---- | --------------- |
| E       | Tension du générateur        | V     | 1   | 12  | 0,5  | 6               |
| R       | Résistance totale du circuit | Ω     | 10  | 100 | 5    | 50              |
| L       | Inductance de la bobine      | H     | 0,1 | 1   | 0,05 | 0,5             |

Le temps va de 0 à 100 ms. Comme pour le RC : lancer, pause, ralenti (×0,25, ×0,5, ×1) et curseur du temps.
Un interrupteur « Établissement / Rupture » choisit la phase étudiée (la rupture part de i = E/R).

## Ce que l'élève voit

- Les courbes i(t) (trait plein, axe de droite en mA) et u_L(t) (pointillés, axe de gauche en V).
- Un repère à t = τ, la tangente à l'origine de i(t) qui coupe l'asymptote I₀ = E/R en t = τ.
- La formule de i(t), où E, R et L/R s'allument quand on bouge leur curseur.
- L'énergie stockée dans la bobine, ½Li², sous forme de barre.

## Vue 3D

Le circuit en boucle avec une bobine en hélice. Vu de dessus, le même circuit en schéma : la résistance se
remplit avec u_R / E, la bobine avec u_L / E, et une flèche indique le courant i, de plus en plus épaisse.

| Objet                 | Forme                                  | Change avec                                        | Ce que ça montre                                           |
| --------------------- | -------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| Générateur            | Cylindre, borne + en haut (petit plot) | E : plus haut quand E augmente                     | La tension disponible                                      |
| Résistance            | Cylindre couché sur le fil du haut     | R : plus longue quand R augmente ; brille avec u_R | Elle fixe le courant final E/R                             |
| Bobine                | Hélice de fil autour d'un tube         | L : plus de spires quand L augmente                | Plus de spires, plus d'inertie électrique                  |
| Lignes de champ       | Anneaux qui traversent la bobine       | i : plus nombreux et plus épais quand i augmente   | Le champ magnétique (et l'énergie ½Li²) grandit avec i     |
| Charges dans les fils | Petites sphères le long du fil         | Vitesse proportionnelle à i                        | Le courant démarre lentement puis atteint sa valeur finale |

Pendant l'animation :

- Les charges des fils partent de l'arrêt et accélèrent jusqu'à une vitesse constante (i → E/R).
- Les anneaux de champ apparaissent un à un ; à t = τ il y en a 63 % du nombre final.
- À la rupture, les charges ralentissent et les anneaux disparaissent : l'énergie de la bobine est rendue au
  circuit.

## Formules

$$
L\frac{di}{dt} + Ri = E \qquad i(t) = \frac{E}{R}\left(1 - e^{-t/\tau}\right) \qquad \tau = \frac{L}{R}
$$

$$
u_L(t) = L\frac{di}{dt} = E\,e^{-t/\tau} \qquad u_R(t) = Ri(t) \qquad E_L = \frac{1}{2}Li^2
$$

À la rupture (à partir de i = I₀) : $i(t) = I_0\,e^{-t/\tau}$ et $u_L = -RI_0\,e^{-t/\tau}$.

Avec L en H et R en Ω, τ est en s (affiché en ms). Termes liés aux curseurs : E, R et L/R.

## Valeurs de référence

Avec E = 6 V, R = 50 Ω, L = 0,5 H :

| Situation                    | Résultat attendu                   |
| ---------------------------- | ---------------------------------- |
| Constante de temps           | τ = 10 ms                          |
| Courant final                | I₀ = E/R = 0,12 A                  |
| t = 0 (établissement)        | i = 0 et u_L = E = 6 V             |
| t = τ                        | i = I₀(1 − e⁻¹) ≈ 75,9 mA (63,2 %) |
| t = 5τ                       | i > 99,3 % de I₀                   |
| Régime permanent             | E_L = ½·0,5·0,12² = 3,6 mJ         |
| Rupture, t = τ               | i = I₀e⁻¹ ≈ 44,1 mA (36,8 %)       |
| Tout instant (établissement) | u_L + u_R = E (loi des mailles)    |

## Étapes commentées

Les étapes dépendent de t/τ (phase d'établissement).

1. **Fermeture** (t/τ < 0,15) : i = 0 et toute la tension E est aux bornes de la bobine. Elle s'oppose à
   l'arrivée du courant : i ne peut pas sauter.
2. **Le courant s'établit** (0,15 à 0,85) : i monte, u_L baisse d'autant, u_L + Ri = E.
3. **t = τ : 63 % de I₀** (0,85 à 1,25) : la tangente à l'origine coupe l'asymptote I₀ = E/R en t = τ.
4. **Le courant se stabilise** (1,25 à 5) : di/dt diminue, la bobine agit de moins en moins.
5. **Régime permanent** (t/τ ≥ 5) : i ≈ E/R, u_L ≈ 0 ; une bobine idéale se comporte comme un fil, et
   stocke l'énergie ½LI₀².

## Erreurs fréquentes des élèves

- Croire qu'augmenter R ralentit l'établissement (τ = L/R diminue : c'est plus rapide, mais I₀ est plus
  petit).
- Penser qu'en régime permanent la bobine « bloque » le courant (elle se comporte comme un fil).
- Oublier la résistance interne r de la bobine dans R (R = R₀ + r).
- Croire que i peut changer brusquement à l'ouverture (c'est la tension u_L qui peut devenir très grande :
  étincelle de rupture).

## Quiz

1. Si on double L, que devient τ ?
   - τ est divisé par 2
   - τ double **(bonne réponse)**
   - τ ne change pas
   - _Explication :_ τ = L/R est proportionnelle à L : doubler L double τ.
2. Si on double R, que devient le courant final I₀ ?
   - Il double
   - Il est divisé par 2 **(bonne réponse)**
   - Il ne change pas
   - _Explication :_ I₀ = E/R : doubler R divise I₀ par 2 (et divise aussi τ par 2).
3. Juste après la fermeture (t = 0), que vaut u_L ?
   - 0
   - E **(bonne réponse)**
   - E/2
   - _Explication :_ i(0) = 0, donc u_R = 0 et toute la tension E est aux bornes de la bobine.
4. En régime permanent, la bobine idéale se comporte comme :
   - Un interrupteur ouvert
   - Un fil **(bonne réponse)**
   - Un condensateur
   - _Explication :_ i est constant donc di/dt = 0 et u_L = L·di/dt = 0.

## Remarques

Même structure que `rc-charging` : la comparaison τ = RC / τ = L/R est un bon fil conducteur. La bobine est
idéale (r incluse dans R). Le phénomène d'auto-induction et la loi u = L·di/dt sont connus partout ; ici on
reste sur l'échelon de tension.
