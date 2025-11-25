# ⚡ Light CRM — Frontend (Angular)

Interface utilisateur du projet **Light CRM**, développée avec **Angular** (Signals) & **TailwindCSS**.  
Conçu pour être **ultra-rapide**, **scalable**, et **agréable à utiliser**.

---

## ✨ Features

- 🔐 **Auth JWT** (Login + route guards)
- 👤 **User Management** (CRUD complet, accès selon rôle)
- 🧲 **Customer Management**
- 📦 **Tableaux** :
  - Recherche serveur
  - Tri serveur
  - Pagination serveur
  - Sélecteur du nombre de résultats
- 🎨 **UI 100% Tailwind**, responsive & moderne
- ⚙️ Architecture **signals-first**
- 🌐 Environnements `.env`
- 🧩 Composants réutilisables (DataTable, Layout…)

---

## 🧰 Stack

- **Angular 20**
- **Signals**
- **TailwindCSS**
- **TypeScript**
- **RxJS**

---

## 🚀 Installation

### 1. Clone
```bash
git clone https://github.com/ya-pou/frontend-light-crm
cd frontend-light-crm
```
### 2. Install
```
npm install
```
### 3. Environments

Créer :  
src/environments/environment.ts :

```bash
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000'
};
```
Et :  
src/environments/environment.prod.ts :

```bash
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.monsupercrm.com'
};
```
---

## 🏁 Run

```bash
npm start
```

- ▶️ App : http://localhost:4200  
- 📡 API attendue sur : http://localhost:3000  

---

## 🔐 Auth

- Login → stockage du JWT  
- Interceptor HTTP → ajout automatique du token  
- Guards → routes protégées  
- Signals → state ultra-léger et réactif  

---

## 🧩 Composants clés

### 🔹 DataTable (shared/components/data-table)

- Search  
- Sort  
- Pagination  
- Limit  
- Responsive  

### 🔹 Layout

- Navbar + Sidebar  
- Mobile-ready  
- Tailwind styling  

---

## 🛠 Scripts

| Commande       | Description             |
|----------------|-------------------------|
| npm start      | Dev server              |
| npm run build  | Build prod              |
| npm run lint   | Vérifier le code        |

---

## 🔗 Backend associé

API NestJS :  
👉 https://github.com/ya-pou/api-light-crm

---

## 📝 Licence

Projet personnel / démonstration.  
Libre pour un usage interne ou éducatif.

---

## 🤝 Auteur

Développé par **Alexis HAAG**  
https://webmate-services.com