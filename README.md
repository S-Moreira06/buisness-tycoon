# Business Tycoon
![](https://komarev.com/ghpvc/?username=S-Moreira06)

[![Expo](https://img.shields.io/badge/Expo-Go-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Business Tycoon** est un idle-game mobile de gestion de patrimoine. Le but est simple : partir de rien, accumuler des ressources via des mécaniques de clic et de gestions d'evenements, et bâtir un empire financier en automatisant ses revenus et dominer le classement.

> **Note** : Ce projet est un développement personnel en cours (WIP).

---

## 📱 Fonctionnalités actuelles

- **Core Gameplay** : Système de clic réactif avec retours haptiques (vibrations) immersifs.
- **Progression** : Gestion des ressources et achat d'améliorations (Upgrades).
- **Compétition** : Classement général (Leaderboard) pour se comparer aux autres joueurs.
- **Authentification** : Système complet (Inscription/Connexion) sécurisé via Firebase Auth.
- **Sauvegarde Cloud** : Vos données sont synchronisées en temps réel.

## 🛠 Stack Technique

Choix technologiques orientés performance et expérience développeur (DX) :

| Technologie | Rôle | Pourquoi ? |
| :--- | :--- | :--- |
| **Expo & Expo Router** | Framework | Navigation native fluide (file-based) et itération rapide. |
| **Zustand** | State Management | Gestion d'état globale simple et performante (vs Redux). |
| **Firebase** | Backend | Auth & Firestore pour le temps réel sans gérer de serveur. |
| **React Native Paper** | UI Kit | Composants visuels cohérents et adaptables. |

## 🚀 Installation & Lancement

Pré-requis : [Node.js](https://nodejs.org/) installé.

1. **Cloner le projet**
   ```bash
   git clone https://github.com/S-Moreira06/buisness-tycoon.git
   cd buisness-tycoon
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   Créez un projet sur la console Firebase, récupérez vos clés, et ajoutez-les dans votre configuration (ex: `firebaseConfig.js` ou variables d'environnement).

4. **Lancer l'application**
   ```bash
   npx expo start
   ```
   - Scannez le QR code avec **Expo Go** (Android/iOS).
   - Ou appuyez sur `w` pour la version Web, `a` pour Android (émulateur), `i` pour iOS (simulateur).

## 📂 Structure du code

```text
app/
├── (auth)/          # Login, Register, Reset Password
├── (game)/          # Zone de jeu protégée
│   ├── (tabs)/      # Navigation principale (Home, Upgrades, Settings)
│   └── _layout.tsx  # Layout du jeu (Header, etc.)
├── _layout.tsx      # Root Navigator & Auth Check
services/            # Intégration Firebase
store/               # Logiciel métier (Zustand stores)
components/          # UI partagée (Boutons, Cards, Modals)
```

## 🗺 Roadmap

**Done**

- [x] Boucle de jeu (Clics & Ressources)
- [x] Auth & Cloud Save
- [x] Navigation par onglets
- [x] Système avancé d'Upgrades de clics et de businesses
- [x] Achievements (Succès)

**A Venir**
- [ ] Early Game (Stats personnages/Metiers/Evenements)
- [ ] Systeme d'upgrades spécifique a chaque business
- [ ] GamePlay spécifique a chaque business (en étude)
- [ ] Managers & Revenus passifs
- [ ] Système de Prestige / Reset

---

**Développé par [S-Moreira06](https://github.com/S-Moreira06)**.
*Projet personnel - Pas de collaboration externe pour le moment.*
