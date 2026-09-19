# VR Couverture — site vitrine

**En ligne : https://znk-v.github.io/vr-couverture/**

Site statique une page. Aucune dépendance, aucun build. Publié par GitHub Pages
depuis la branche `main` ; tout `git push` met le site à jour en une minute.
Les chemins sont relatifs, donc le site fonctionne aussi bien sous
`/vr-couverture/` qu'à la racine d'un domaine.

## Aperçu local

```bash
python3 -m http.server 4173 --directory .
```

Puis http://localhost:4173

---

## À COMPLÉTER avant mise en ligne

Cinq valeurs sont des marqueurs et doivent être remplacées. Elles apparaissent dans
`index.html`, `js/site.js`, `mentions-legales.html` et `politique-confidentialite.html`.

| Marqueur | État |
|----------|------|
| Téléphone `07 59 51 87 26` / `tel:+33759518726` | ✅ en place |
| `contact@vr-couverture.fr` | ❌ à remplacer par la vraie adresse (elle reçoit les demandes du formulaire) |
| `znk-v.github.io/vr-couverture` | ⚠️ URL provisoire dans canonical, Open Graph, sitemap et JSON-LD |
| `à compléter` | ❌ SIRET, TVA, code APE, assurance décennale, hébergeur, médiateur |

Commande de remplacement pour les deux premiers (adapter les valeurs) :

```bash
# adresse de réception du formulaire
grep -rl 'contact@vr-couverture\.fr' . --include='*.html' --include='*.js' \
  | xargs sed -i '' 's/contact@vr-couverture\.fr/vraie@adresse.fr/g'
```

### Passage au domaine définitif

```bash
# 1. basculer les URLs absolues (canonical, OG, sitemap, robots, JSON-LD)
grep -rl 'znk-v.github.io/vr-couverture' . --include='*.html' --include='*.xml' --include='*.txt' \
  | xargs sed -i '' 's|https://znk-v.github.io/vr-couverture/|https://vrai-domaine.fr/|g'
# 2. déclarer le domaine à GitHub Pages
echo "vrai-domaine.fr" > CNAME
git add -A && git commit -m "Domaine vrai-domaine.fr" && git push
```

Côté registrar : un CNAME `www` vers `znk-v.github.io`, et pour l'apex les quatre
A records GitHub (185.199.108/109/110/111.153).

Vérifier ensuite `grep -rn "à compléter" .`

### Formulaire

L'envoi passe par `https://formsubmit.co/ajax/{email}`. Le premier envoi déclenche un
courriel de confirmation d'adresse chez FormSubmit : il faut cliquer le lien une fois,
sinon rien n'arrive. Si la requête échoue, le site ouvre un SMS pré-rempli vers le numéro.

### Avis Google

Aucune note n'est affichée : l'entreprise démarre, donc aucun avis réel à citer. Dès qu'il
y a une fiche Google avec des avis, ajouter dans le hero, à côté des CTA :

```html
<p class="points"><li>★ 5,0 · 12 avis Google</li></p>
```

et le bloc `aggregateRating` correspondant dans le JSON-LD `RoofingContractor`.
Ne rien afficher tant que la note n'est pas vérifiable sur la fiche.

---

## Structure

```
index.html                    page unique
css/style.css                 feuille unique, tokens en tête
js/site.js                    galerie, lightbox, comparateur, formulaire
fonts/                        Barlow + Barlow Condensed, woff2 latin
img/                          hero, g1-g12 (+ vignettes -sm), ba/ (avant-après)
assets-source/photos-source/  les 32 photos d'origine, hors déploiement
DESIGN.md                     direction artistique
```

`assets-source/` n'a pas besoin d'être publié.

## Zone d'intervention

Vingt-deux communes autour de Linas, listées en dur dans la section `#zone` et dans le
`areaServed` du JSON-LD. Les deux listes doivent rester identiques.

## SEO

- `RoofingContractor` + `FAQPage` en JSON-LD, la FAQ balisée reprend mot pour mot la FAQ visible
- `sitemap.xml`, `robots.txt`, canonical, Open Graph 1200 × 630
- un seul `h1`, contenant le métier et la ville
