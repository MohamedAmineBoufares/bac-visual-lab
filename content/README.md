# Fiches de leçons · Lesson docs

Chaque leçon de Bac Visual Lab est décrite par une fiche dans [`lessons/`](lessons/). La fiche dit ce que
la simulation doit montrer. Le code est ensuite écrit à partir d'elle, et la page de la leçon affiche un lien
vers sa fiche et sa dernière modification.

## Enseignants : proposer ou améliorer une leçon

Pas besoin de savoir programmer.

- **Sans Git :** ouvrez une
  [proposition de leçon](https://github.com/MohamedAmineBoufares/bac-visual-lab/issues/new?template=lesson-proposal.yml)
  et remplissez le formulaire. Nous en ferons la fiche.
- **Avec Git :** copiez [`TEMPLATE.md`](TEMPLATE.md) dans `lessons/<id>.md` (ou modifiez une fiche
  existante), remplissez-la et ouvrez une pull request.

L'`id` est celui du chapitre dans [`src/lessons/lessons.ts`](../src/lessons/lessons.ts), par exemple
`rl-circuit`. La liste des chapitres prévus s'y trouve. [`lessons/rc-charging.md`](lessons/rc-charging.md)
est un exemple complet.

À chaque modification :

1. augmentez `version` (1.0.0 → 1.1.0 pour un ajout, → 1.0.1 pour une correction) ;
2. ajoutez une ligne **en haut** du tableau Historique ;
3. reportez la version, la date, l'auteur et la version cible de cette ligne dans l'en-tête.

Le contenu doit être original : ne copiez pas de texte ou de figures des manuels du CNP. En proposant une
fiche, vous acceptez qu'elle soit publiée sous [licence MIT](../LICENSE).

## Relecture et réalisation

1. **draft** : la fiche est proposée.
2. **accepted** : le mainteneur a vérifié la physique ou les maths.
3. **built** : la simulation est en ligne. Elle est construite en suivant [`BUILD.md`](BUILD.md).

---

**English:** each lesson has a doc in `lessons/`, written from [`TEMPLATE.md`](TEMPLATE.md) (in French, the
language of the Tunisian programme; English or Arabic docs are welcome too). Propose one through the
[lesson proposal form](https://github.com/MohamedAmineBoufares/bac-visual-lab/issues/new?template=lesson-proposal.yml)
or a pull request. Bump `version`, add a row at the top of the History table and copy it into the front
matter on every change. Accepted docs are turned into code with [`BUILD.md`](BUILD.md).
