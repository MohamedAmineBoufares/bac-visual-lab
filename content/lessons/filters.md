---
id: filters
title: Filtres électriques
subject: physics
sections: mathematiques, sciences-techniques
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

Un filtre laisse passer certaines fréquences et en atténue d'autres. Avec un filtre RC, l'élève voit la
transmittance T = U_s,m / U_e,m changer avec la fréquence, lit la fréquence de coupure N_c = 1/(2πRC) à −3 dB
sur le diagramme de Bode, et compare passe-bas et passe-haut.

## Ce que l'élève règle

| Symbole | Grandeur              | Unité | Min  | Max    | Pas                        | Valeur initiale |
| ------- | --------------------- | ----- | ---- | ------ | -------------------------- | --------------- |
| N       | Fréquence de l'entrée | Hz    | 10   | 100000 | échelle log, 20 pas/décade | 1000            |
| R       | Résistance            | kΩ    | 0,1  | 10     | 0,1                        | 1               |
| C       | Capacité              | µF    | 0,01 | 1      | 0,01                       | 0,1             |

Un bouton choisit « Passe-bas » (sortie aux bornes de C) ou « Passe-haut » (sortie aux bornes de R).
L'amplitude d'entrée U_e,m est fixée à 5 V.

## Ce que l'élève voit

- L'oscilloscope : u_e(t) (trait plein) et u_s(t) (pointillés), avec l'amplitude de sortie et le déphasage
  écrits.
- Le diagramme de Bode : gain G(N) = 20 log T en dB, axe des fréquences logarithmique, un point qui suit N,
  la droite à −3 dB et N_c marquée par un trait vertical.
- L'état du point écrit : « bande passante » ou « bande coupée ».

## Vue 3D

Le filtre comme un montage traversé par le signal : entrée, résistance, condensateur, sortie. Vu de dessus,
la sortie se remplit avec T.

| Objet            | Forme                                      | Change avec                                  | Ce que ça montre                                        |
| ---------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------------------------------- |
| Signal d'entrée  | Ruban sinusoïdal qui avance vers le filtre | N : ondulations plus serrées ; hauteur U_e,m | Le signal qui entre, toujours de même amplitude         |
| Résistance       | Cylindre couché                            | R : plus longue                              | Avec C, elle fixe N_c                                   |
| Condensateur     | Deux armatures                             | C : armatures plus grandes                   | Il se charge bien aux basses fréquences, pas aux hautes |
| Signal de sortie | Ruban sinusoïdal qui sort du filtre        | Hauteur T·U_e,m, crêtes décalées de φ        | Ce que le filtre garde                                  |

Pendant l'animation :

- Le ruban d'entrée garde la même hauteur ; celui de sortie s'aplatit quand N passe dans la bande coupée.
- Le décalage entre les crêtes d'entrée et de sortie montre le déphasage (−45° ou +45° à N_c).

## Formules

Passe-bas (sortie aux bornes de C) :

$$
T = \frac{1}{\sqrt{1 + (2\pi N RC)^2}} \qquad \varphi = -\arctan(2\pi N RC)
$$

Passe-haut (sortie aux bornes de R) :

$$
T = \frac{2\pi N RC}{\sqrt{1 + (2\pi N RC)^2}} \qquad \varphi = \frac{\pi}{2} - \arctan(2\pi N RC)
$$

Dans les deux cas :

$$
G = 20\log T \qquad N_c = \frac{1}{2\pi RC} \qquad G(N_c) = -3\ \text{dB}
$$

φ est le déphasage de u_s par rapport à u_e. Termes liés aux curseurs : N et RC.

## Valeurs de référence

Avec R = 1 kΩ, C = 0,1 µF :

| Situation              | Résultat attendu                         |
| ---------------------- | ---------------------------------------- |
| Fréquence de coupure   | N_c ≈ 1591,5 Hz                          |
| Passe-bas, N = N_c     | T = 1/√2 ≈ 0,707, G ≈ −3,01 dB, φ = −45° |
| Passe-bas, N = 10 N_c  | T ≈ 0,0995, G ≈ −20,04 dB                |
| Passe-bas, N → 0       | T → 1, G → 0 dB                          |
| Passe-haut, N = N_c    | T ≈ 0,707, φ = +45°                      |
| Passe-haut, N = N_c/10 | G ≈ −20,04 dB                            |

## Étapes commentées

L'élève fait varier N ; les étapes dépendent de N/N_c (passe-bas).

1. **Basses fréquences** (N/N_c < 0,1) : le condensateur a le temps de se charger à chaque période, la sortie
   recopie l'entrée (G ≈ 0 dB).
2. **Le filtre commence à agir** (0,1 à 0,7) : la sortie diminue un peu et prend du retard.
3. **Fréquence de coupure** (0,7 à 1,4) : à N = N_c, U_s,m = U_e,m/√2, G = −3 dB, retard de 45°.
4. **Bande coupée** (1,4 à 10) : le condensateur n'a plus le temps de se charger ; le gain baisse de 20 dB
   par décade.
5. **Très hautes fréquences** (N/N_c > 10) : la sortie est presque nulle. En passe-haut, c'est l'inverse.

## Erreurs fréquentes des élèves

- Confondre transmittance T et gain G (−3 dB ne veut pas dire T = −3).
- Croire qu'à N_c la sortie vaut la moitié de l'entrée (elle vaut 70,7 %).
- Lire l'axe des fréquences comme s'il était linéaire.
- Penser qu'un filtre passif amplifie (T ≤ 1 toujours).

## Quiz

1. À la fréquence de coupure, que vaut G ?
   - −1 dB
   - −3 dB **(bonne réponse)**
   - −20 dB
   - _Explication :_ T = 1/√2 et 20 log(1/√2) ≈ −3 dB.
2. Si on double R, que devient N_c ?
   - Elle double
   - Elle est divisée par 2 **(bonne réponse)**
   - Elle ne change pas
   - _Explication :_ N_c = 1/(2πRC) est inversement proportionnelle à R.
3. Un passe-bas RC, pour N très grand :
   - Laisse tout passer
   - Coupe presque tout **(bonne réponse)**
   - Amplifie le signal
   - _Explication :_ Le condensateur se comporte comme un fil, la tension à ses bornes tend vers 0.
4. Dans la bande coupée d'un passe-bas du premier ordre, le gain baisse de :
   - 3 dB par décade
   - 20 dB par décade **(bonne réponse)**
   - 6 dB par décade
   - _Explication :_ Pour N ≫ N_c, T ≈ N_c/N : multiplier N par 10 divise T par 10, soit −20 dB.

## Remarques

Les filtres actifs (amplificateur opérationnel, passe-bas inverseur) et le passe-bande RLC pourront devenir
d'autres modes, en réutilisant le modèle de `rlc-forced`. Exemple concret : les réglages graves / aigus d'un
égaliseur audio.
