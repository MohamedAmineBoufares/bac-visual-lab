---
id: mech-forced
title: Oscillations mécaniques forcées
subject: physics
sections: mathematiques, sciences-techniques
chapter: Mécanique
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

Un excitateur impose une force sinusoïdale de fréquence N au pendule élastique. Le solide oscille à la
fréquence N, et l'amplitude de sa vitesse est maximale quand N égale la fréquence propre N₀ (résonance de
vitesse). Le frottement fixe la hauteur et la largeur de la résonance.

## Ce que l'élève règle

| Symbole | Grandeur                         | Unité | Min  | Max | Pas  | Valeur initiale |
| ------- | -------------------------------- | ----- | ---- | --- | ---- | --------------- |
| N       | Fréquence de l'excitateur        | Hz    | 0,2  | 4   | 0,01 | 1               |
| F_m     | Amplitude de la force            | N     | 0,1  | 1   | 0,05 | 0,5             |
| h       | Coefficient de frottement fluide | kg/s  | 0,1  | 2   | 0,05 | 0,5             |
| k       | Raideur du ressort               | N/m   | 5    | 50  | 1    | 20              |
| m       | Masse du solide                  | kg    | 0,05 | 1   | 0,05 | 0,2             |

## Ce que l'élève voit

- La courbe x(t) en régime permanent (trait plein) et la force F(t) (pointillés), avec le déphasage écrit.
- Deux courbes de résonance en fonction de N : amplitude X_m (trait plein) et amplitude de la vitesse V_m
  (tirets), un point qui suit N, N₀ marquée par un trait vertical.
- La puissance moyenne reçue de l'excitateur P = ½F_mV_m cos φ, maximale à N₀.

## Vue 3D

Le pendule élastique relié à un excitateur (moteur avec une came) et plongé dans un liquide. Vu de dessus,
le solide se remplit avec V_m / V_m,max.

| Objet      | Forme                                          | Change avec               | Ce que ça montre                                   |
| ---------- | ---------------------------------------------- | ------------------------- | -------------------------------------------------- |
| Excitateur | Disque qui tourne avec une bielle              | N : rotation plus rapide  | Il impose la fréquence                             |
| Ressort    | Hélice entre la bielle et le solide            | x(t) ; k : fil plus épais | Il transmet la force                               |
| Solide     | Cube                                           | x(t) ; m : cube plus gros | Il oscille à N, avec une amplitude qui dépend de N |
| Cuve       | Cuve de liquide sous le cube, avec une palette | h : liquide plus opaque   | Le frottement limite l'amplitude                   |
| Trace      | Ruban laissé derrière le cube                  | Défile dans le temps      | La sinusoïde x(t) se dessine                       |

Pendant l'animation :

- Au début, un court régime transitoire, puis le cube oscille au rythme du disque.
- En approchant N₀, le cube oscille de plus en plus fort ; avec h petit, très fort.

## Formules

$$
m\frac{d^2x}{dt^2} + h\frac{dx}{dt} + kx = F_m\sin(2\pi N t) \qquad x(t) = X_m\sin(2\pi N t + \varphi)
$$

$$
X_m = \frac{F_m}{\sqrt{(k - m\omega^2)^2 + (h\omega)^2}} \qquad V_m = \omega X_m \qquad \omega = 2\pi N
$$

$$
N_0 = \frac{1}{2\pi}\sqrt{\frac{k}{m}} \qquad V_{m,\max} = \frac{F_m}{h}\ \text{(à N = N₀)}
$$

La résonance d'amplitude (X_m maximale) a lieu à $N_r = N_0\sqrt{1 - \frac{h^2}{2km}}$, un peu avant N₀, et
n'existe que si h < √(2km). Analogie : m ↔ L, h ↔ R, k ↔ 1/C, F ↔ u, v ↔ i. Termes liés aux curseurs : N,
F_m, h, k, m.

## Valeurs de référence

Avec F_m = 0,5 N, h = 0,5 kg/s, k = 20 N/m, m = 0,2 kg :

| Situation             | Résultat attendu                    |
| --------------------- | ----------------------------------- |
| Fréquence propre      | N₀ = 5/π ≈ 1,592 Hz (ω₀ = 10 rad/s) |
| N = N₀                | V_m = F_m/h = 1 m/s, X_m = 0,1 m    |
| N → 0                 | X_m → F_m/k = 2,5 cm                |
| Résonance d'amplitude | N_r ≈ 1,567 Hz, X_m ≈ 10,08 cm      |
| N = N₀, puissance     | P = ½F_mV_m = 0,25 W                |

## Étapes commentées

L'élève fait varier N ; les étapes dépendent de N/N₀.

1. **Excitation lente** (N/N₀ < 0,5) : le solide suit l'excitateur, X_m ≈ F_m/k.
2. **On approche N₀** (0,5 à 0,95) : l'amplitude grandit.
3. **Résonance** (0,95 à 1,05) : la vitesse est en phase avec la force, l'excitateur transmet le plus
   d'énergie.
4. **Au-delà** (1,05 à 2) : le solide n'arrive plus à suivre, l'amplitude diminue.
5. **Excitation rapide** (N/N₀ > 2) : le solide bouge à peine. Diminuer h rend la résonance plus aiguë.

## Erreurs fréquentes des élèves

- Croire que le solide oscille à N₀ (il oscille à N).
- Confondre résonance d'amplitude (un peu avant N₀) et résonance de vitesse (exactement à N₀).
- Penser que le frottement déplace N₀ (il change la hauteur et la largeur, presque pas la position).

## Quiz

1. À quelle fréquence oscille le solide en régime permanent ?
   - À N₀
   - À N, la fréquence de l'excitateur **(bonne réponse)**
   - À 2N
   - _Explication :_ En régime forcé, l'oscillateur suit l'excitateur.
2. À la résonance de vitesse, que vaut V_m ?
   - F_m/k
   - F_m/h **(bonne réponse)**
   - F_m/m
   - _Explication :_ À N₀, k − mω² = 0, il reste hω·X_m = F_m, donc V_m = F_m/h.
3. Si on augmente h, la résonance devient :
   - Plus aiguë
   - Plus floue (pic plus bas et plus large) **(bonne réponse)**
   - Décalée vers les hautes fréquences
   - _Explication :_ V_m,max = F_m/h diminue et la courbe s'élargit.

## Remarques

Même structure que `rlc-forced`. Exemples du quotidien : balançoire poussée au bon rythme, amortisseurs
de voiture, pont qui vibre sous des pas cadencés.
