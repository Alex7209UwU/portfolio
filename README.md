# Portfolio — Alexis AILHAS-GIROUD

Portfolio one-page (HTML/CSS/JS pur) — zéro dépendance, zéro base de données. Hébergement gratuit sur GitHub Pages.

## Fonctionnalités

- Design bleu marine + gris foncé, mode sombre/clair
- Responsive mobile, tablette, desktop
- Animations au scroll (AOS)
- CV et lettre de motivation embarqués depuis Canva
- Statistiques live depuis l'API GitLab v4
- Blog avec ajout/suppression depuis l'admin
- Formulaire de contact : **FormSubmit** (100% gratuit, illimité), **Formspree** ou mailto
- Drag & drop pour avatar et fichiers PDF
- Réseaux sociaux dynamiques (Instagram, X, GitHub, YouTube…)
- Interface admin **plein écran** avec mot de passe
- Export/import de la configuration en JSON
- CSS personnalisé injecté depuis l'admin
- Raccourci clavier : `Ctrl + Shift + A`
- Config persistée dans `localStorage`

## Fichiers

```
index.html      → structure de la page + admin panel
css/style.css   → thème, responsive, admin panel
js/app.js       → toute la logique (thème, API, admin, blog, contact)
```

## Test en local

❌ Ne fonctionne pas correctement depuis `file:///` (les iframes Canva sont bloquées).

### 1. Serveur HTTP local

```powershell
cd C:\Users\alex7\Downloads\CV_LM
python -m http.server 8080
```

Ouvre http://localhost:8080

### 2. Test sur le LAN

```powershell
# Trouve ton IP locale :
ipconfig
# Ex: 192.168.1.42
python -m http.server 8080
```

Les autres appareils du réseau ouvrent http://192.168.1.42:8080

## Déploiement GitHub Pages

### 1. Créer le dépôt

Va sur https://github.com/new
- **Repository name** : `portfolio` (ou `alex7209.github.io` pour utiliser l'URL racine)
- **Public**
- Ne coche pas "Initialize with README"

### 2. Pousser les fichiers

```powershell
cd C:\Users\alex7\Downloads\CV_LM
git init
git add .
git commit -m "Premier commit — Portfolio"
git remote add origin https://github.com/alex7209/portfolio.git
git branch -M main
git push -u origin main
```

### 3. Activer GitHub Pages

1. Va sur `https://github.com/alex7209/portfolio`
2. Settings → Pages (menu latéral)
3. Source : **Deploy from a branch**
4. Branch : **main** → **/(root)**
5. Save

⏳ Attends 1-2 minutes. Le site sera en ligne à :
```
https://alex7209.github.io/portfolio/
```

### 4. Vérifier

- Les iframes Canva fonctionnent (HTTPS résout le blocage)
- Le formulaire FormSubmit fonctionne (HTTPS requis pour l'API fetch)
- Mets à jour le mot de passe admin par défaut

### 5. Mettre à jour

```powershell
git add .
git commit -m "Description des changements"
git push
```

GitHub Pages met à jour automatiquement en 1-2 min.

## Interface admin

- **Accès** : clic sur le 🔒 en bas à droite (ou Ctrl+Shift+A)
- **Mot de passe par défaut** : `admin123` (à changer dans l'admin → Avancé)
- **Onglets** : Contenu, Documents, Réseaux, Blog, Design, Avancé

### Contenu
- Nom, titre, bio (s'affichent dans le hero)
- URL avatar (image ou drag & drop d'une photo)
- Visibilité des sections (CV, Lettre, Projets, Blog)

### Documents
- Liens Canva publics (CV + Lettre) → intégrés en iframe
- Liens PDF → drag & drop ou URL externe

### Réseaux
- LinkedIn, GitLab, email, téléphone, adresse
- **Autres réseaux** : Instagram, X, GitHub, YouTube, TikTok, etc. — ajout/suppression libre
- **Service email** : FormSubmit (gratuit illimité), Formspree, ou mailto
  - Pour FormSubmit : entrez votre email, les messages vous sont forwardés

### Blog
- Ajout d'articles (titre + contenu + lien optionnel)
- Suppression avec confirmation
- Les articles sont persistés en localStorage

### Design
- Couleur d'accent (live preview)
- Thème par défaut (Sombre/Clair/Système)
- Police du titre
- CSS personnalisé (injection en direct)

### Avancé
- Changer le mot de passe
- Exporter/importer la configuration (fichier JSON)
- Réinitialiser tout le site

## Email gratuit — FormSubmit

Le service **FormSubmit** est intégré et ne nécessite aucun compte :
1. Dans l'admin → Réseaux → Service d'envoi → **FormSubmit**
2. Entrez votre email dans le champ "Votre email"
3. Sauvegardez
4. Les messages du formulaire de contact vous arrivent directement par email

Limite : ouvre une popup de confirmation après chaque envoi. Gratuit et sans limite.

## Dépannage

### Les iframes Canva ne s'affichent pas
- Le site doit être servi en **HTTPS** (GitHub Pages le fait automatiquement)
- En local : utilisez `python -m http.server` (pas `file://`)
- Vérifiez que le lien Canva est bien un **lien public**

### Le formulaire n'envoie pas
- **FormSubmit** nécessite HTTPS (GitHub Pages ✅, localhost ✅, file:// ❌)
- **Formspree** : vérifiez l'URL (ex: `https://formspree.io/f/xxxxxx`)
- En dernier recours : utilisez **Mailto** (ouvre le client email)

### L'admin ne s'ouvre pas
- Vérifiez le mot de passe dans localStorage (console → `localStorage.getItem('portfolio_config')`)
- Réinitialisez avec `localStorage.clear()` dans la console, puis rechargez la page

## Licence

Projet personnel — librement inspiré et modifiable.
