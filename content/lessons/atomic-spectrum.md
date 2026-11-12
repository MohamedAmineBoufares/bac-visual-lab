---
id: atomic-spectrum
title: Spectre atomique
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
chapter: Physique atomique et nucléaire
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

L'énergie de l'atome est quantifiée : l'atome d'hydrogène ne peut avoir que les énergies E_n = −13,6/n² eV.
En passant d'un niveau à un niveau plus bas, il émet un photon d'énergie exactement égale à la différence,
donc d'une seule longueur d'onde : c'est pour cela que le spectre est fait de raies.

## Ce que l'élève règle

| Symbole | Grandeur         | Unité | Min | Max | Pas | Valeur initiale |
| ------- | ---------------- | ----- | --- | --- | --- | --------------- |
| p       | Niveau de départ | —     | 2   | 6   | 1   | 3               |
| n       | Niveau d'arrivée | —     | 1   | 5   | 1   | 2               |

n est toujours plus petit que p (le curseur se bloque). Un bouton choisit « Émission » (p → n) ou
« Absorption » (n → p). Un bouton « Ionisation » montre le passage de n = 1 à l'infini.

## Ce que l'élève voit

- Le diagramme des niveaux d'énergie (traits horizontaux, n et E_n écrits), avec la transition dessinée par
  une flèche verticale.
- La valeur du photon : ΔE en eV, λ en nm, ν en Hz, et le domaine écrit (ultraviolet, visible, infrarouge).
- Le spectre de raies d'émission (raies sur fond sombre) ou d'absorption (raies sombres sur fond continu)
  de 380 à 750 nm, la raie choisie marquée d'un triangle et de sa valeur.
- Les séries nommées : Lyman (n = 1), Balmer (n = 2), Paschen (n = 3).

## Vue 3D

Le diagramme d'énergie en 3D : une « échelle » de plateaux où l'électron saute. Vu de dessus, le même
diagramme à plat, le plateau occupé rempli.

| Objet               | Forme                                                     | Change avec                                                | Ce que ça montre                                         |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| Niveaux             | Plateaux circulaires, de plus en plus serrés vers le haut | Fixes, hauteur = E_n                                       | Les niveaux se rapprochent quand n grandit               |
| Électron            | Petite sphère posée sur un plateau                        | p puis n : saute d'un plateau à l'autre                    | L'atome change d'état d'un coup, sans état intermédiaire |
| Photon              | Train d'onde qui part de l'atome                          | λ : ondulations plus serrées si λ plus court ; étiquette λ | L'énergie émise ou absorbée                              |
| Limite d'ionisation | Plateau en pointillés tout en haut (E = 0)                | Rien                                                       | Au-delà, l'électron quitte l'atome                       |

Pendant l'animation :

- L'électron descend de p à n et un train d'onde s'éloigne ; plus la chute est grande, plus l'onde est serrée.
- En absorption, un train d'onde arrive et l'électron monte ; un photon d'une autre énergie traverse sans
  rien faire.

## Formules

$$
E_n = -\frac{13{,}6}{n^2}\ \text{eV} \qquad \Delta E = E_p - E_n = h\nu = \frac{hc}{\lambda}
$$

$$
\frac{1}{\lambda} = R_H\left(\frac{1}{n^2} - \frac{1}{p^2}\right) \qquad R_H \approx 1{,}097 \times 10^{7}\ \text{m}^{-1}
$$

Constantes : h = 6,626 × 10⁻³⁴ J·s, c = 3,00 × 10⁸ m/s, 1 eV = 1,602 × 10⁻¹⁹ J (hc ≈ 1240 eV·nm).
Termes liés aux curseurs : n et p.

## Valeurs de référence

| Situation            | Résultat attendu                       |
| -------------------- | -------------------------------------- |
| Niveau fondamental   | E₁ = −13,6 eV                          |
| n = 2                | E₂ = −3,4 eV                           |
| 3 → 2 (Balmer Hα)    | ΔE ≈ 1,89 eV, λ ≈ 656 nm (rouge)       |
| 4 → 2 (Balmer Hβ)    | ΔE = 2,55 eV, λ ≈ 486 nm (bleu-vert)   |
| 2 → 1 (Lyman α)      | ΔE = 10,2 eV, λ ≈ 122 nm (ultraviolet) |
| Énergie d'ionisation | 13,6 eV depuis n = 1                   |
| 3 → 2, fréquence     | ν ≈ 4,57 × 10¹⁴ Hz                     |

## Étapes commentées

1. **L'atome au repos** : l'électron est au niveau fondamental n = 1, l'état le plus stable.
2. **Excitation** : en absorbant un photon (ou un choc) d'énergie exactement E_p − E₁, l'atome monte au
   niveau p.
3. **Désexcitation** : l'atome redescend, en une ou plusieurs étapes, et émet un photon à chaque saut.
4. **Une raie par saut** : chaque saut a son énergie, donc sa longueur d'onde ; l'ensemble forme le spectre
   de raies, propre à l'hydrogène.
5. **Ionisation** : avec 13,6 eV ou plus, l'électron quitte l'atome ; au-delà, toutes les énergies sont
   possibles.

## Erreurs fréquentes des élèves

- Croire que l'atome peut absorber n'importe quel photon (seulement ceux d'énergie égale à un écart de
  niveaux, sauf ionisation).
- Oublier le signe : E_n est négative, l'énergie du photon est la différence (positive).
- Confondre λ grand et énergie grande (E = hc/λ : grande énergie, petite λ).
- Oublier de convertir les eV en joules avant d'utiliser h.

## Quiz

1. Pourquoi le spectre de l'hydrogène est-il fait de raies ?
   - Le gaz est froid
   - L'énergie de l'atome est quantifiée **(bonne réponse)**
   - Le prisme sépare mal les couleurs
   - _Explication :_ Seules certaines différences d'énergie existent, donc seules certaines λ sont émises.
2. Quelle transition donne le photon le plus énergétique ?
   - 3 → 2
   - 2 → 1 **(bonne réponse)**
   - 5 → 4
   - _Explication :_ E₂ − E₁ = 10,2 eV, bien plus que les écarts entre niveaux élevés.
3. Un photon de 1,89 eV éclaire un atome d'hydrogène au niveau 2. Il :
   - Ne fait rien
   - Fait monter l'atome au niveau 3 **(bonne réponse)**
   - Ionise l'atome
   - _Explication :_ E₃ − E₂ = −1,51 − (−3,40) ≈ 1,89 eV : le photon a exactement la bonne énergie.
4. Quelle est l'énergie d'ionisation de l'hydrogène dans son état fondamental ?
   - 3,4 eV
   - 13,6 eV **(bonne réponse)**
   - 10,2 eV
   - _Explication :_ Il faut passer de E₁ = −13,6 eV à E = 0.

## Remarques

La vue 3D est un diagramme d'énergie, pas une image de l'atome : ne pas dessiner d'orbites planétaires
(modèle de Bohr) comme si c'était la réalité, ou alors le dire. Les couleurs des raies sont toujours
accompagnées de leur valeur en nm. Le spectre d'autres éléments (sodium, mercure) pourra être ajouté à partir
de valeurs mesurées publiées.
