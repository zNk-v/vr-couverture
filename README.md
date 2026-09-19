# VR Couverture — site vitrine

Site statique une page. Aucune dépendance, aucun build. Se déploie tel quel sur
GitHub Pages, Netlify ou un hébergement mutualisé.

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
| `vr-couverture.fr` | ❌ à remplacer par le vrai nom de domaine |
| `à compléter` | ❌ SIRET, TVA, code APE, assurance décennale, hébergeur, médiateur |

Commande de remplacement pour les deux premiers (adapter les valeurs) :

```bash
grep -rl 'vr-couverture\.fr' . --include='*.html' --include='*.js' | xargs sed -i '' \
  -e 's/contact@vr-couverture\.fr/vraie@adresse.fr/g' \
  -e 's/vr-couverture\.fr/vrai-domaine.fr/g'
```

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
