---
id: nuclear-reactions
title: Réactions nucléaires
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

Un noyau radioactif se désintègre au hasard, mais un grand nombre de noyaux suit une loi précise :
N(t) = N₀e^(−λt). Au bout d'une demi-vie T½, il reste la moitié des noyaux. L'énergie libérée vient de la
perte de masse : E = Δm·c².

## Ce que l'élève règle

| Symbole | Grandeur                       | Unité | Min | Max  | Pas | Valeur initiale |
| ------- | ------------------------------ | ----- | --- | ---- | --- | --------------- |
| N₀      | Nombre initial de noyaux       | —     | 100 | 1000 | 100 | 400             |
| T½      | Demi-vie (période radioactive) | s     | 1   | 60   | 1   | 10              |

Le temps va de 0 à 6 T½ ; lancer, pause, ralenti, curseur du temps. Un bouton « Nouveau tirage » relance le
hasard. Un second onglet « Énergie » montre le défaut de masse d'un noyau choisi (²H, ⁴He, ⁵⁶Fe, ²³⁵U).

## Ce que l'élève voit

- Une grille de N₀ noyaux : pleins (non désintégrés) ou creux (désintégrés), qui changent un à un au hasard.
- La courbe théorique N(t) (trait plein) et le compte réel de la grille (marches en pointillés), avec des
  repères à T½, 2T½, 3T½.
- L'activité A(t) = λN(t) écrite en Bq.
- Onglet « Énergie » : la balance des masses (nucléons séparés contre noyau), Δm en u, E_l en MeV et E_l/A,
  avec la courbe d'Aston (E_l/A en fonction de A) et le noyau choisi marqué.

## Vue 3D

Un échantillon de noyaux dans une boîte, et la décomposition d'un noyau. Vu de dessus, la grille de noyaux,
chaque case pleine ou creuse.

| Objet                      | Forme                                                         | Change avec                           | Ce que ça montre                                            |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| Noyaux non désintégrés     | Grosses sphères pleines                                       | N(t) : leur nombre diminue            | Ce qui reste de l'échantillon                               |
| Noyaux désintégrés         | Petits cubes creux                                            | Apparaissent un par un, au hasard     | Chaque désintégration est imprévisible                      |
| Particule émise            | Petite sphère qui part en ligne droite (α) ou flèche fine (β) | Une par désintégration                | Le rayonnement émis                                         |
| Compteur                   | Cylindre avec un chiffre                                      | Nombre de désintégrations par seconde | L'activité diminue avec N                                   |
| Noyau ⁴He (onglet Énergie) | 2 sphères (protons) et 2 cubes (neutrons) qui s'assemblent    | Masse affichée avant / après          | La masse du noyau est plus petite que celle de ses nucléons |

Pendant l'animation :

- Au début, beaucoup de noyaux se désintègrent ; ensuite de moins en moins, car il en reste moins.
- À t = T½, environ la moitié des sphères sont devenues des cubes (pas exactement : c'est le hasard).

## Formules

$$
N(t) = N_0\,e^{-\lambda t} \qquad T_{1/2} = \frac{\ln 2}{\lambda} \qquad A(t) = \lambda N(t) = A_0\,e^{-\lambda t}
$$

$$
\Delta m = Zm_p + (A - Z)m_n - m(\text{noyau}) \qquad E_l = \Delta m\,c^2 \qquad 1\ \text{u} \leftrightarrow 931{,}5\ \text{MeV}
$$

Lois de conservation dans une réaction : nombre de charge Z et nombre de masse A. Masses :
m_p = 1,00728 u, m_n = 1,00866 u. Termes liés aux curseurs : N₀ et T½ (dans λ).

## Valeurs de référence

Avec N₀ = 400, T½ = 10 s :

| Situation                      | Résultat attendu                                 |
| ------------------------------ | ------------------------------------------------ |
| Constante radioactive          | λ = ln 2 / 10 ≈ 0,0693 s⁻¹                       |
| t = T½                         | N = 200                                          |
| t = 3T½                        | N = 50 (12,5 %)                                  |
| Activité initiale              | A₀ = λN₀ ≈ 27,7 Bq                               |
| ⁴He (m = 4,00151 u)            | Δm = 0,03037 u, E_l ≈ 28,3 MeV, E_l/A ≈ 7,07 MeV |
| Tirage au hasard (graine fixe) | Même suite de désintégrations à chaque test      |

## Étapes commentées

Les étapes dépendent de t/T½.

1. **Échantillon neuf** (t = 0) : N₀ noyaux, activité maximale.
2. **Désintégrations au hasard** (0 à 1) : on ne sait pas quel noyau va se désintégrer, mais leur nombre
   suit la loi exponentielle.
3. **Une demi-vie** (t = T½) : il reste la moitié des noyaux.
4. **Encore une demi-vie** (1 à 3) : à chaque T½, on perd la moitié de ce qui reste (pas N₀/2 à chaque fois).
5. **Fin** (t ≥ 5 T½) : il reste moins de 4 % des noyaux ; l'activité est presque nulle.

## Erreurs fréquentes des élèves

- Croire qu'après 2 T½ tous les noyaux ont disparu (il en reste un quart).
- Penser qu'on peut prévoir quel noyau va se désintégrer.
- Confondre λ (constante radioactive, en s⁻¹) et la longueur d'onde.
- Oublier que l'énergie de liaison par nucléon, pas l'énergie totale, mesure la stabilité.

## Quiz

1. Après 2 demi-vies, quelle fraction des noyaux reste-t-il ?
   - 0
   - 1/4 **(bonne réponse)**
   - 1/2
   - _Explication :_ La moitié de la moitié : N₀/2 puis N₀/4.
2. Si T½ double, que devient λ ?
   - Elle double
   - Elle est divisée par 2 **(bonne réponse)**
   - Elle ne change pas
   - _Explication :_ λ = ln 2 / T½ est inversement proportionnelle à T½.
3. D'où vient l'énergie libérée par une réaction nucléaire ?
   - De la combustion des noyaux
   - D'une perte de masse, E = Δm·c² **(bonne réponse)**
   - De l'énergie des électrons
   - _Explication :_ Les produits sont plus légers que les réactifs ; la masse manquante devient énergie.
4. Dans une réaction nucléaire, qu'est-ce qui se conserve ?
   - La masse
   - Le nombre de charge et le nombre de masse **(bonne réponse)**
   - Le nombre de neutrons
   - _Explication :_ Lois de Soddy : la somme des Z et la somme des A sont les mêmes avant et après.

## Remarques

Le hasard doit venir d'un générateur à graine fixe pour que le modèle reste testable. Exemples connus à
citer : datation au carbone 14 (T½ ≈ 5730 ans), fission de l'uranium 235 (environ 200 MeV par noyau) dans
les centrales, fusion de l'hydrogène dans le Soleil.
