# DESIGN.md — VR Couverture

Direction : **le métal et la tuile**. Le logo de Vincent Rossalino est un monogramme chromé
sous un toit rouge, posé sur noir. Le site reprend ce triptyque sans le diluer : fond noir
sur les moments forts, rouge réservé à l'action, filets chrome comme tissu conjonctif.
Objectif unique : faire décrocher le téléphone.

---

## 1. Palette (extraite du fichier logo, pipette réelle)

Le rouge échantillonné dans le logo est `#EC070E` en haut de dégradé, `#A60202` en bas.
On retient `#D81017`, seule valeur qui passe AA à la fois en fond de bouton (blanc dessus)
et en texte sur fond clair.

| Token | Hex | Rôle | Contraste |
|-------|-----|------|-----------|
| `--noir` | `#0E1013` | Fond des sections signature : en-tête, hero, avant/après, zone, contact. | — |
| `--noir-2` | `#07080A` | Barre de navigation, pied de page. | — |
| `--acier` | `#171B21` | Cartes et champs sur fond sombre. | — |
| `--trait` | `#272D35` | Bordures sur sombre. | — |
| `--chrome` | `#EDF1F5` | Texte principal sur sombre. | 16:1 ✓ AAA |
| `--zinc` | `#A8B0B9` | Texte secondaire sur sombre. | 10:1 ✓ AAA |
| `--rouge` | `#D81017` | **Action seulement** : boutons, onglet actif, carré de surtitre, poignée du comparateur. | blanc dessus 5,2:1 ✓ AA · sur clair 4,8:1 ✓ AA |
| `--rouge-clair` | `#FF4A3D` | Petit texte rouge sur fond sombre (mot accentué du h1, pictos, erreurs). | 5,6:1 ✓ AA |
| `--craie` | `#F3F5F7` | Fond clair des sections de lecture. | — |
| `--encre` | `#14181D` | Texte sur fond clair. | 15:1 ✓ AAA |
| `--ardoise` | `#5A626B` | Texte secondaire sur fond clair. | 5,5:1 ✓ AA |
| `--metal` | dégradé | `linear-gradient` 6 arrêts gris/blanc : filet de surtitre, filet sous la photo du hero, règle du comparateur. Jamais en fond de surface. | — |

Audit automatique passé dans le navigateur : 0 paire texte/fond sous le seuil AA.

**Pourquoi ce n'est pas un interdit du skill :** pas de crème + serif + terracotta, pas de
dégradé SaaS, pas de glassmorphism. Le noir vient du logo lui-même, qui est conçu pour
fond noir. Le rouge n'est pas un accent décoratif : c'est la couleur de marque, et elle ne
sert qu'à cliquer.

---

## 2. Typographie

Deux familles, woff2 auto-hébergées (73 Ko au total), sous-ensemble latin, `font-display: swap`.

- **Display — Barlow Condensed 700**, en capitales. Grotesque condensée à angles coupés :
  registre panneau de chantier et lettrage métal, en écho au « COUVERTURE » du logo.
- **Corps — Barlow 400 / 600 / 700.** Même dessin, chasse normale. Une seule famille
  typographique élargie, donc zéro friction entre titres et texte.

Volontairement différent des deux autres sites du portefeuille : Bricolage Grotesque + Inter
chez Lafleur, Archivo + IBM Plex chez Felicioni.

| Élément | Mobile | Desktop | Réglage |
|---------|--------|---------|---------|
| Surtitre | 12,5 px | 12,5 px | Barlow 700, CAPS, tracking .14em |
| h1 | 34 px | 60 px | Condensed 700, CAPS, LH 1.05 |
| h2 | 27 px | 42 px | Condensed 700, CAPS |
| h3 | 20–22 px | 20–22 px | Condensed 700, CAPS |
| Corps | 16 px | 17 px | Barlow 400, LH 1.6, mesure 64ch |
| Bouton | 16 px | 16 px | Barlow 700, hauteur 52 px |

Préchargement des deux seules polices du premier écran (Condensed 700, Barlow 400).

---

## 3. Signature

**Le comparateur avant / après.** Modèle d'interaction repris du composant *Compare Reveal*
(21st.dev, MIT) et réécrit en JavaScript sans dépendance :

- révélation par `clip-path: inset()` sur un calque composité, les deux photos peintes une
  seule fois ;
- la règle poursuit le pointeur via un ressort `k=140, c=18` (ζ≈0,76), donc le retard se lit
  comme une résistance élastique et le relâchement comme un accrochage doux ;
- **balayage d'auto-démonstration** à la première entrée dans le viewport : 50 → 94 → 6 → 50
  en 2,6 s, relancé seulement s'il a été interrompu ;
- poignée = vrai `button` avec sémantique `role="slider"` : flèches 2 %, Maj+flèches 10 %,
  Origine/Fin aux extrêmes, `aria-valuenow` suivi ;
- double-clic pour recentrer, boucle `rAF` coupée hors écran, mode fixe sous
  `prefers-reduced-motion`.

Deux chantiers réels, deux onglets : la longère en pierre (le poteau et le coffret EDF
servent de repère d'alignement entre les deux prises de vue) et la grange.

**Tissu conjonctif :** chaque surtitre de section porte un carré rouge plein de 9 px, le
quadrant de la fenêtre du logo, suivi d'un filet chrome de 96 × 2 px. Répété partout,
jamais commenté. Le même filet chrome sépare le comparateur de la galerie.

---

## 3 bis. Prestations : bento de tuiles photo

Sept métiers, sept tuiles sombres dont la photo occupe toute la surface, sur trame de
six colonnes. Couverture tient deux rangées à gauche, Dépannage ferme en bande pleine
largeur avec le numéro d'urgence dedans. Chaque tuile porte son numéro d'ordre en
Barlow Condensed fantôme, un dégradé qui verrouille la lisibilité du texte
(`.97 → .9 → .42 → .26`) et, au survol, un zoom d'image à 1,055 plus un filet rouge qui
passe de 34 à 84 px. Le texte reste visible sans survol : rien d'essentiel ne dépend du
pointeur.

## 3 ter. Chantiers : mosaïque filtrable

Douze photos sur une grille de douze colonnes en `grid-auto-flow: dense`, cinq gabarits
de tuile (`t-xl`, `t-md`, `t-wd`, `t-po`, carré) choisis d'après l'orientation réelle de
chaque cliché. Cinq filtres métier avec compteur, l'entrée en cascade décale chaque tuile
de 45 ms, et la lightbox ne navigue que dans le sous-ensemble filtré : compteur `n / total`,
préchargement des deux voisines, balayage tactile horizontal pour changer de photo et
vertical pour fermer. Fond `--noir-2` : les toitures ressortent mieux sur presque noir que
sur fond clair.

---

## 4. Layout

Page unique, mobile d'abord, contenu à 1180 px max, gouttières 20 px / 32 px.
Rythme vertical unique : `clamp(56px, 9vw, 104px)` par section, deux tiers de cette valeur
pour les sections courtes. Alternance sombre / clair :

```
en-tête noir · HERO noir · prestations clair · AVANT-APRÈS noir ·
chantiers clair · étapes clair · zone noir · faq clair · CONTACT noir · pied noir
```

Barre d'appel fixe en bas sous 1024 px, deux moitiés : « Appeler » rouge, « Devis gratuit »
noir. Sa hauteur est mesurée en JS et injectée dans `--sticky-h`, que le `body` reprend en
`padding-bottom` pour ne jamais masquer le pied de page.

---

## 5. Photos

Trente-deux photos de chantier ont été récupérées, quatorze retenues. Les dix-huit écartées
portaient toutes le marquage d'une autre entreprise : camion floqué, panneau de chantier et
numéro de téléphone concurrent. Deux photos conservées ont été recadrées pour sortir un
bandeau du champ. Aucune banque d'images, aucune image générée.

Dérivés WebP : 1100 px pour la lightbox et les cartes, 620 px pour les vignettes,
1200 px pour les deux paires du comparateur, 860 px pour la photo du hero.
Total images : 2,9 Mo pour 32 fichiers, toutes les vues sous le pli chargées en priorité,
le reste en `loading="lazy"` avec `width`/`height` déclarés (CLS nul).
