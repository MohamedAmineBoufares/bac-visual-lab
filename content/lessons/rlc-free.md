---
id: rlc-free
title: Oscillations électriques libres
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

Voir un condensateur chargé se décharger dans une bobine : l'énergie passe du condensateur à la bobine et
revient, la tension oscille. Sans résistance l'oscillation dure toujours (période propre T₀ = 2π√(LC)) ; avec
une résistance elle s'amortit (régime pseudo-périodique), et une grande résistance l'empêche (régime
apériodique).

## Ce que l'élève règle

| Symbole | Grandeur                         | Unité | Min  | Max | Pas  | Valeur initiale |
| ------- | -------------------------------- | ----- | ---- | --- | ---- | --------------- |
| U₀      | Tension initiale du condensateur | V     | 1    | 10  | 0,5  | 5               |
| L       | Inductance de la bobine          | H     | 0,05 | 1   | 0,05 | 0,1             |
| C       | Capacité                         | µF    | 1    | 20  | 1    | 10              |
| R       | Résistance totale du circuit     | Ω     | 0    | 300 | 5    | 20              |

Le temps va de 0 à 8 T₀ (l'échelle suit L et C). Lancer, pause, ralenti et curseur du temps comme pour le RC.

## Ce que l'élève voit

- La courbe u_C(t) (trait plein) et son enveloppe ±U₀e^(−t/τ) (pointillés) quand R > 0.
- Le nom du régime affiché : « périodique » (R = 0), « pseudo-périodique » (R < R_c), « apériodique »
  (R ≥ R_c), avec R_c = 2√(L/C).
- Un graphique d'énergie : E_C (trait plein), E_L (tirets) et E totale (trait épais), constante si R = 0,
  décroissante sinon.
- La période propre T₀ et la pseudo-période T mesurée entre deux maximums.

## Vue 3D

Le circuit en boucle : condensateur, bobine, résistance. Vu de dessus, le condensateur se remplit avec
|u_C| / U₀ et la bobine avec |i| / I_max ; la flèche du courant change de sens à chaque demi-période.

| Objet                 | Forme                                            | Change avec                                     | Ce que ça montre                                           |
| --------------------- | ------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------- |
| Condensateur          | Deux armatures, sphères (+) et carrés (−) dessus | q(t) : les + passent d'une armature à l'autre   | La charge change de signe à chaque demi-période            |
| Bobine                | Hélice de fil autour d'un tube                   | L : plus de spires quand L augmente             | Elle « relance » le courant quand le condensateur est vide |
| Lignes de champ       | Anneaux dans la bobine                           | \|i\| : plus nombreux quand le courant est fort | L'énergie est dans la bobine quand u_C = 0                 |
| Résistance            | Cylindre couché                                  | R : plus longue ; brille avec Ri²               | Elle transforme l'énergie en chaleur (amortissement)       |
| Charges dans les fils | Petites sphères                                  | Vitesse et sens donnés par i(t)                 | Le courant va et vient                                     |

Pendant l'animation :

- Les charges vont et viennent dans les fils ; elles s'arrêtent quand le condensateur est plein.
- Les anneaux de champ sont au maximum quand le condensateur est vide, et inversement.
- Avec R > 0, chaque aller-retour est plus petit ; la résistance brille à chaque passage du courant.

## Formules

$$
L\frac{d^2q}{dt^2} + R\frac{dq}{dt} + \frac{q}{C} = 0 \qquad T_0 = 2\pi\sqrt{LC} \qquad R_c = 2\sqrt{\frac{L}{C}}
$$

Sans résistance :

$$
u_C(t) = U_0\cos\left(\frac{2\pi}{T_0}t\right)
$$

Avec R < R_c (régime pseudo-périodique) :

$$
u_C(t) \approx U_0\,e^{-t/\tau}\cos(\omega t) \qquad \tau = \frac{2L}{R} \qquad \omega = \sqrt{\omega_0^2 - \frac{1}{\tau^2}} \qquad \omega_0 = \frac{1}{\sqrt{LC}}
$$

Le modèle utilise la solution exacte des trois régimes, avec i(0) = 0.

$$
E = \frac{1}{2}Cu_C^2 + \frac{1}{2}Li^2 \qquad \frac{dE}{dt} = -Ri^2
$$

Termes liés aux curseurs : U₀, LC (dans T₀) et R.

## Valeurs de référence

Avec U₀ = 5 V, L = 0,1 H, C = 10 µF :

| Situation           | Résultat attendu                                 |
| ------------------- | ------------------------------------------------ |
| Période propre      | T₀ = 2π × 10⁻³ s ≈ 6,283 ms (f₀ ≈ 159,2 Hz)      |
| Énergie initiale    | E₀ = ½CU₀² = 125 µJ                              |
| R = 0, t = T₀/2     | u_C = −U₀ = −5 V                                 |
| R = 0, t = T₀/4     | u_C = 0, \|i\| = U₀√(C/L) = 50 mA, E_L = E₀      |
| R = 0, tout instant | E_C + E_L = 125 µJ                               |
| Résistance critique | R_c = 200 Ω                                      |
| R = 20 Ω            | pseudo-période T ≈ 6,315 ms (un peu plus que T₀) |
| R = 300 Ω           | régime apériodique : u_C ne change pas de signe  |

## Étapes commentées

Les étapes dépendent de t/T₀ (avec R = 0 ; pour R > 0 le même découpage se répète en s'amortissant).

1. **Condensateur chargé** (t = 0) : toute l'énergie est dans le condensateur, i = 0.
2. **Décharge dans la bobine** (0 à T₀/4) : le courant augmente, l'énergie passe dans la bobine.
3. **Condensateur vide** (t = T₀/4) : u_C = 0 mais le courant est maximal ; la bobine pousse les charges plus
   loin.
4. **Charge inversée** (T₀/4 à T₀/2) : le condensateur se recharge à l'envers, u_C = −U₀ à T₀/2.
5. **Retour** (T₀/2 à T₀) : même chose en sens inverse ; à t = T₀ on est revenu au départ. Avec R, chaque
   aller-retour perd de l'énergie en chaleur.

## Erreurs fréquentes des élèves

- Croire que la pseudo-période dépend beaucoup de R (elle reste proche de T₀ tant que l'amortissement est
  faible).
- Confondre T₀ = 2π√(LC) avec τ = RC ou τ = L/R.
- Penser que l'énergie « disparaît » quand u_C = 0 (elle est dans la bobine).
- Croire que doubler C double T₀ (T₀ est multipliée par √2).

## Quiz

1. Si on multiplie C par 4, que devient T₀ ?
   - Elle est multipliée par 4
   - Elle double **(bonne réponse)**
   - Elle ne change pas
   - _Explication :_ T₀ = 2π√(LC) : multiplier C par 4 multiplie √(LC) par 2.
2. Quand u_C = 0 (R = 0), où est l'énergie ?
   - Elle est perdue
   - Dans la bobine **(bonne réponse)**
   - Dans la résistance
   - _Explication :_ E = ½Cu_C² + ½Li² reste constante : si u_C = 0, toute l'énergie vaut ½Li².
3. Pourquoi l'amplitude diminue-t-elle quand R > 0 ?
   - La bobine absorbe l'énergie
   - La résistance transforme l'énergie en chaleur **(bonne réponse)**
   - Le condensateur se décharge tout seul
   - _Explication :_ dE/dt = −Ri² : l'énergie est dissipée par effet Joule.
4. Que se passe-t-il si R dépasse 2√(L/C) ?
   - Les oscillations sont plus rapides
   - Il n'y a plus d'oscillation (régime apériodique) **(bonne réponse)**
   - L'amplitude augmente
   - _Explication :_ Au-delà de la résistance critique, u_C revient vers 0 sans changer de signe.

## Remarques

Garder visible l'analogie avec `mech-free` (L ↔ m, 1/C ↔ k, R ↔ h, q ↔ x). Un mode « entretien des
oscillations » (résistance négative) pourra être ajouté plus tard.
