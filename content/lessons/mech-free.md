---
id: mech-free
title: Oscillations mécaniques libres
subject: physics
sections: sciences-experimentales, mathematiques, sciences-techniques
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

Un solide accroché à un ressort horizontal, écarté puis lâché, oscille autour de sa position d'équilibre avec
la période propre T₀ = 2π√(m/k), qui ne dépend pas de l'amplitude. L'énergie passe sans cesse de la forme
potentielle élastique à la forme cinétique ; les frottements l'amortissent.

## Ce que l'élève règle

| Symbole | Grandeur                         | Unité | Min  | Max | Pas  | Valeur initiale |
| ------- | -------------------------------- | ----- | ---- | --- | ---- | --------------- |
| X₀      | Élongation initiale              | cm    | 1    | 10  | 0,5  | 5               |
| k       | Raideur du ressort               | N/m   | 5    | 50  | 1    | 20              |
| m       | Masse du solide                  | kg    | 0,05 | 1   | 0,05 | 0,2             |
| h       | Coefficient de frottement fluide | kg/s  | 0    | 2   | 0,05 | 0,1             |

Le solide est lâché sans vitesse initiale. Le temps va de 0 à 8 T₀ ; lancer, pause, ralenti, curseur du temps.

## Ce que l'élève voit

- La courbe x(t) (trait plein) et son enveloppe (pointillés) quand h > 0.
- Le diagramme des énergies : E_c (tirets), E_p (trait plein), E_m (trait épais), constante si h = 0.
- Le vecteur vitesse (flèche) et le vecteur force de rappel (flèche à double trait) sur le solide.
- Le régime écrit : « périodique », « pseudo-périodique », « apériodique » (h ≥ 2√(km)).

## Vue 3D

Le pendule élastique horizontal sur un banc à coussin d'air. Vu de dessus, le ressort se remplit avec E_p/E_m
et le solide avec E_c/E_m.

| Objet              | Forme                                      | Change avec                                | Ce que ça montre                                 |
| ------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------------ |
| Support fixe       | Plaque verticale à gauche                  | Rien                                       | Le point d'attache                               |
| Ressort            | Hélice qui s'étire et se comprime          | x(t) ; k : fil plus épais quand k augmente | La force de rappel F = −kx                       |
| Solide             | Cube sur le banc                           | x(t) ; m : cube plus gros quand m augmente | Plus lourd, plus lent                            |
| Repère d'équilibre | Trait vertical sur le banc (x = 0)         | Rien                                       | Le solide va vite en passant ici                 |
| Flèche vitesse     | Flèche au-dessus du cube                   | v(t) : longueur et sens                    | La vitesse est maximale à x = 0, nulle aux bords |
| Liquide (si h > 0) | Palette sous le cube plongée dans une cuve | h : cuve plus opaque quand h augmente      | Le frottement fluide amortit                     |

Pendant l'animation :

- Le cube ralentit aux extrémités, s'arrête un instant, puis repart.
- Avec h > 0, chaque aller-retour est plus court ; avec h grand, le cube revient à l'équilibre sans le
  dépasser.

## Formules

$$
m\frac{d^2x}{dt^2} + h\frac{dx}{dt} + kx = 0 \qquad T_0 = 2\pi\sqrt{\frac{m}{k}} \qquad \omega_0 = \sqrt{\frac{k}{m}}
$$

Sans frottement :

$$
x(t) = X_0\cos(\omega_0 t) \qquad v(t) = -X_0\,\omega_0\sin(\omega_0 t)
$$

$$
E_m = \frac{1}{2}mv^2 + \frac{1}{2}kx^2 = \frac{1}{2}kX_0^2 \qquad \frac{dE_m}{dt} = -hv^2
$$

Avec frottement, le modèle utilise la solution exacte des trois régimes (h critique : h_c = 2√(km)).
Termes liés aux curseurs : X₀, m/k (dans T₀), h.

## Valeurs de référence

Avec X₀ = 5 cm, k = 20 N/m, m = 0,2 kg :

| Situation           | Résultat attendu                |
| ------------------- | ------------------------------- |
| Pulsation propre    | ω₀ = 10 rad/s                   |
| Période propre      | T₀ = π/5 ≈ 0,628 s              |
| h = 0, t = T₀/4     | x = 0 et \|v\| = X₀ω₀ = 0,5 m/s |
| h = 0, t = T₀/2     | x = −5 cm                       |
| Énergie mécanique   | E_m = ½kX₀² = 25 mJ             |
| Frottement critique | h_c = 2√(km) = 4 kg/s           |
| X₀ = 10 cm          | T₀ inchangée (isochronisme)     |

## Étapes commentées

Les étapes dépendent de t/T₀ (h = 0).

1. **Lâcher** (t = 0) : ressort étiré, vitesse nulle ; toute l'énergie est potentielle élastique.
2. **Retour vers l'équilibre** (0 à T₀/4) : la force de rappel accélère le solide.
3. **Passage à l'équilibre** (t = T₀/4) : x = 0, force nulle, vitesse maximale ; toute l'énergie est
   cinétique.
4. **Compression** (T₀/4 à T₀/2) : le ressort freine le solide, qui s'arrête à x = −X₀.
5. **Retour** (T₀/2 à T₀) : le mouvement recommence en sens inverse. Avec h > 0, une partie de l'énergie est
   perdue à chaque aller-retour.

## Erreurs fréquentes des élèves

- Croire que la période dépend de l'amplitude (pour un ressort idéal, elle n'en dépend pas).
- Penser que la vitesse est maximale aux extrémités (elle y est nulle).
- Inverser m et k dans T₀ = 2π√(m/k).
- Croire que la force de rappel est maximale à l'équilibre (elle y est nulle).

## Quiz

1. Si on multiplie m par 4, que devient T₀ ?
   - Elle est divisée par 2
   - Elle double **(bonne réponse)**
   - Elle est multipliée par 4
   - _Explication :_ T₀ = 2π√(m/k) est proportionnelle à √m.
2. Où la vitesse du solide est-elle maximale ?
   - Aux extrémités
   - À la position d'équilibre **(bonne réponse)**
   - Au milieu entre l'équilibre et une extrémité
   - _Explication :_ À x = 0, E_p = 0 donc toute l'énergie mécanique est cinétique.
3. Si on double l'amplitude X₀ (h = 0), la période :
   - Double
   - Ne change pas **(bonne réponse)**
   - Est divisée par 2
   - _Explication :_ T₀ ne dépend que de m et k : c'est l'isochronisme des oscillations.
4. Avec h > 0, que devient l'énergie mécanique ?
   - Elle reste constante
   - Elle diminue **(bonne réponse)**
   - Elle augmente
   - _Explication :_ dE_m/dt = −hv² < 0 : le frottement transforme l'énergie en chaleur.

## Remarques

Même structure que `rlc-free`, pour que l'élève voie l'analogie électrique ↔ mécanique (m ↔ L, k ↔ 1/C,
h ↔ R). Le pendule pesant simple pourra être un autre mode (T₀ = 2π√(l/g) aux petits angles).
