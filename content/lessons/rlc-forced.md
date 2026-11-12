---
id: rlc-forced
title: Oscillations électriques forcées
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

Un générateur basse fréquence impose sa fréquence N au circuit RLC série. L'intensité suit N, et son amplitude
est maximale quand N égale la fréquence propre N₀ = 1/(2π√(LC)) : c'est la résonance d'intensité. Plus R est
petite, plus la résonance est aiguë.

## Ce que l'élève règle

| Symbole | Grandeur                       | Unité | Min  | Max | Pas  | Valeur initiale |
| ------- | ------------------------------ | ----- | ---- | --- | ---- | --------------- |
| N       | Fréquence du générateur        | Hz    | 20   | 500 | 1    | 100             |
| U_m     | Tension maximale du générateur | V     | 1    | 10  | 0,5  | 5               |
| R       | Résistance totale              | Ω     | 10   | 200 | 5    | 50              |
| L       | Inductance                     | H     | 0,05 | 1   | 0,05 | 0,1             |
| C       | Capacité                       | µF    | 1    | 20  | 1    | 10              |

## Ce que l'élève voit

- Un écran d'oscilloscope à deux voies : u(t) (trait plein) et Ri(t) (pointillés), avec le déphasage φ écrit
  et marqué par une flèche entre deux maximums.
- La courbe de résonance I_m(N) (trait plein), un point qui suit N, et la bande passante [N₁, N₂] marquée par
  deux traits verticaux à I_m,max/√2.
- La nature du circuit écrite : « capacitif » (N < N₀), « résistif » (N = N₀), « inductif » (N > N₀).
- La puissance moyenne P = ½U_mI_m cos φ.

## Vue 3D

Le circuit série : générateur BF, résistance, bobine, condensateur. Vu de dessus, chaque dipôle se remplit avec
l'amplitude de sa tension divisée par U_m, ce qui montre la surtension aux bornes de C à la résonance.

| Objet                 | Forme                                         | Change avec                     | Ce que ça montre                             |
| --------------------- | --------------------------------------------- | ------------------------------- | -------------------------------------------- |
| Générateur BF         | Boîte avec un cadran dont l'aiguille tourne   | N : l'aiguille tourne plus vite | Le générateur impose la fréquence            |
| Résistance            | Cylindre couché                               | Brille avec Ri²                 | Le courant est maximal à la résonance        |
| Bobine                | Hélice avec anneaux de champ                  | Anneaux qui suivent i(t)        | L'énergie magnétique échangée                |
| Condensateur          | Deux armatures avec sphères (+) et carrés (−) | Charges qui suivent q(t)        | La surtension : U_C,m peut dépasser U_m      |
| Charges dans les fils | Petites sphères                               | Vont et viennent avec i(t)      | L'amplitude du va-et-vient est maximale à N₀ |

Pendant l'animation :

- Les charges vont et viennent à la fréquence N du générateur, pas à N₀.
- En approchant N₀, le va-et-vient s'agrandit et la résistance brille plus fort.

## Formules

$$
u(t) = U_m\sin(2\pi N t) \qquad i(t) = I_m\sin(2\pi N t - \varphi) \qquad \omega = 2\pi N
$$

$$
I_m = \frac{U_m}{Z} \qquad Z = \sqrt{R^2 + \left(L\omega - \frac{1}{C\omega}\right)^2} \qquad \tan\varphi = \frac{L\omega - \frac{1}{C\omega}}{R}
$$

$$
N_0 = \frac{1}{2\pi\sqrt{LC}} \qquad Q = \frac{L\omega_0}{R} = \frac{U_{C,m}}{U_m} \qquad \Delta N = N_2 - N_1 = \frac{R}{2\pi L} = \frac{N_0}{Q}
$$

$$
P = \frac{1}{2}U_m I_m\cos\varphi = \frac{1}{2}RI_m^2
$$

φ est le déphasage de u par rapport à i (positif pour un circuit inductif) ; Q et U_C,m = Q·U_m sont pris à la
résonance. Termes liés aux curseurs : N, U_m, R, L, C.

## Valeurs de référence

Avec U_m = 5 V, R = 50 Ω, L = 0,1 H, C = 10 µF :

| Situation                | Résultat attendu                                 |
| ------------------------ | ------------------------------------------------ |
| Fréquence propre         | N₀ ≈ 159,2 Hz                                    |
| N = N₀                   | Z = R = 50 Ω, I_m = 0,1 A, φ = 0                 |
| Facteur de qualité       | Q = 2, donc U_C,m = 10 V à la résonance          |
| Bande passante           | ΔN = R/(2πL) ≈ 79,6 Hz                           |
| N = 2N₀ (ω = 2000 rad/s) | Z ≈ 158,1 Ω, I_m ≈ 31,6 mA, tan φ = 3 (inductif) |
| Puissance à la résonance | P = 0,25 W                                       |

## Étapes commentées

L'élève fait varier N ; les étapes dépendent de N/N₀.

1. **Basse fréquence** (N/N₀ < 0,7) : le condensateur limite le courant, i est en avance sur u (circuit
   capacitif).
2. **On approche la résonance** (0,7 à 0,97) : I_m augmente vite, le déphasage diminue.
3. **Résonance** (0,97 à 1,03) : Z = R, i et u sont en phase, I_m est maximal ; la tension aux bornes de C
   vaut Q·U_m.
4. **Au-delà** (1,03 à 1,5) : la bobine limite le courant, i est en retard sur u (circuit inductif).
5. **Haute fréquence** (N/N₀ > 1,5) : I_m redevient faible. Diminuer R rend le pic plus haut et plus étroit.

## Erreurs fréquentes des élèves

- Croire que le circuit oscille à N₀ (il oscille à N, la fréquence du générateur).
- Penser que R déplace N₀ (R change la hauteur et la largeur du pic, pas sa position).
- Confondre le signe du déphasage entre circuit inductif et capacitif.
- Croire qu'une tension du circuit ne peut pas dépasser celle du générateur (surtension U_C,m = Q·U_m).

## Quiz

1. À quelle fréquence oscille l'intensité ?
   - À N₀
   - À N, la fréquence du générateur **(bonne réponse)**
   - À une fréquence entre N et N₀
   - _Explication :_ En régime forcé, le circuit suit la fréquence imposée par le générateur.
2. À la résonance d'intensité, que vaut Z ?
   - Z = 0
   - Z = R **(bonne réponse)**
   - Z = Lω
   - _Explication :_ Lω₀ = 1/(Cω₀) : les deux termes s'annulent et Z = R.
3. Si on diminue R, que devient la résonance ?
   - Plus aiguë : pic plus haut et plus étroit **(bonne réponse)**
   - Elle se décale vers les hautes fréquences
   - Elle disparaît
   - _Explication :_ I_m,max = U_m/R augmente et ΔN = R/(2πL) diminue ; N₀ ne change pas.
4. Pour N > N₀, le circuit est :
   - Capacitif
   - Inductif **(bonne réponse)**
   - Résistif
   - _Explication :_ Lω > 1/(Cω) : l'intensité est en retard sur la tension.

## Remarques

À présenter après `rlc-free`, avec la même analogie que `mech-forced`. Exemples du quotidien : accord d'une
radio sur une station, verre qui casse sous un son.
