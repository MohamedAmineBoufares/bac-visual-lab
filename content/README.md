# Fiches de leçons · Lesson docs

Chaque leçon de Bac Visual Lab est décrite par une fiche dans [`lessons/`](lessons/). La fiche dit ce que
la simulation doit montrer. Le code est ensuite écrit à partir d'elle, et la page de la leçon affiche un lien
vers sa fiche et sa dernière modification.

## Enseignants : proposer ou améliorer une leçon

Pas besoin de savoir programmer.

- **Sans Git :** ouvrez une
  [proposition de leçon](https://github.com/MohamedAmineBoufares/bac-visual-lab/issues/new?template=lesson-proposal.yml)
  et choisissez le chapitre dans la liste. Nous en ferons la fiche.
- **Avec Git :** chaque chapitre du programme a déjà sa fiche dans [`lessons/`](lessons/), avec l'en-tête
  rempli (`id`, sections, chapitre). Ouvrez celle de votre chapitre, remplissez-la et ouvrez une pull request.
  Les fiches encore vides ont `status: todo`.

[`TEMPLATE.md`](TEMPLATE.md) explique chaque partie. [`lessons/rc-charging.md`](lessons/rc-charging.md)
est un exemple complet, y compris la section facultative « Vue 3D » qui décrit le montage que l'élève fait
tourner en 3D.

À chaque modification :

1. augmentez `version` (1.0.0 → 1.1.0 pour un ajout, → 1.0.1 pour une correction) ;
2. ajoutez une ligne **en haut** du tableau Historique ;
3. reportez la version, la date, l'auteur et la version de l'app de cette ligne dans l'en-tête.

`version` est la version de la fiche elle-même. `app-version` est la version de l'application (affichée en bas
de la page d'accueil) dans laquelle la modification sera en ligne.

Le contenu doit être original : ne copiez pas de texte ou de figures des manuels du CNP. En proposant une
fiche, vous acceptez qu'elle soit publiée sous [licence MIT](../LICENSE).

## Relecture et réalisation

1. **todo** : la fiche est vide, prête à être remplie.
2. **draft** : la fiche est proposée.
3. **accepted** : le mainteneur a vérifié la physique ou les maths.
4. **built** : la simulation est en ligne. Elle est construite en suivant [`BUILD.md`](BUILD.md).

---

**English:** every chapter already has a doc in `lessons/` with its front matter set; empty ones have
`status: todo`. Fill in the one for your chapter, following [`TEMPLATE.md`](TEMPLATE.md) (in French, the
language of the Tunisian programme; English or Arabic docs are welcome too). Propose one through the
[lesson proposal form](https://github.com/MohamedAmineBoufares/bac-visual-lab/issues/new?template=lesson-proposal.yml)
or a pull request. Bump `version`, add a row at the top of the History table and copy it into the front
matter on every change. Accepted docs are turned into code with [`BUILD.md`](BUILD.md).
