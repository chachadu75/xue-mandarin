# Xué 学 : le mandarin HSK 3, 10 minutes par jour

Web app installable sur iPhone (PWA) pour apprendre le chinois par l'écrit : lire les caractères, les tracer, écrire le pinyin avec les tons et les prononcer, avec une répétition espacée façon Anki (algorithme FSRS).

## Ce qu'il y a dedans

- **301 mots HSK 3** (programme 2012) répartis en 13 thèmes, chacun avec une traduction française et une phrase d'exemple.
- **4 exercices par mot**, planifiés séparément par FSRS :
  - **Lecture** : voir les caractères, se souvenir du son et du sens, se noter avec les 4 boutons Anki.
  - **Pinyin** : clavier intégré avec touches de ton (ā á ǎ à), correction automatique syllabe par syllabe (ton neutre et sandhi de 一 gérés).
  - **Tracé** : écrire le caractère trait par trait (Hanzi Writer), avec le modèle la première fois, puis de mémoire.
  - **Oral** : reconnaissance vocale en chinois, plus l'enregistrement de ta voix pour la comparer au modèle.
- **Session guidée** : révisions dues et nouveaux mots en alternance, arrêt au bout du temps choisi (10 min par défaut).
- Couleurs des tons partout : 1 rouge, 2 orange, 3 vert, 4 bleu, neutre gris.
- Lexique avec recherche, fiche de chaque mot, entraînement libre au tracé, statistiques, mode sombre, export et import de la progression.

## Lancer en local

```bash
npm install
npm run dev
```

## Mettre sur iPhone

Le micro, la reconnaissance vocale et le mode hors ligne exigent une adresse en **HTTPS** : il faut donc héberger l'app.
Le workflow `.github/workflows/deploy.yml` la publie sur GitHub Pages à chaque push sur `main`.
Ensuite, sur l'iPhone : ouvrir l'adresse dans Safari, **Partager**, **Sur l'écran d'accueil**.

Les progrès sont stockés sur le téléphone (localStorage). Pense à exporter une sauvegarde de temps en temps (Réglages).

## Crédits

- Données de tracé : [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) via `hanzi-writer-data` (Arphic Public License)
- Tracé : [Hanzi Writer](https://hanziwriter.org) (MIT)
- Répétition espacée : [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (MIT)
- Pinyin des phrases : [pinyin-pro](https://github.com/zh-lx/pinyin-pro) (MIT)
