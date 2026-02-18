
# Habitro 🌿

**Habitro** is a modern, minimalist habit tracker designed to help you build and maintain positive routines. Built with **React Native (Expo)**, it features a beautiful dark-themed UI, streak tracking, and insightful analytics to keep you motivated.

<div align="center">
  <!-- You can add a screenshot of the app here later -->
  <img src="./assets/images/icon.png" width="120" height="120" style="border-radius: 20px" alt="Habitro Logo" />
</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Building for Android](#-building-for-android)
- [License](#-license)

---

## ✨ Features

- **Personalized Routine Tracking**: Create, edit, and manage your daily habits with ease.
- **Smart Analytics**: Visualize your progress with interactive charts and heatmaps.
- **Gamified Growth**: Watch your virtual plant grow as you complete tasks.
- **Seamless Auth**: Secure cloud-based synchronization (MongoDB + Express).
- **Beautiful UI**: Polished Dark Mode interface inspired by Material Design 3.
- **Haptic Feedback**: Satisfying interactions for every completion.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Storage**: MongoDB (Backend), AsyncStorage (Local token cache)
- **Styling**: Custom Theme System (M3 inspired)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app on your phone (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habitro.git
   cd habitro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   > **Note**: If you want to run the backend locally, ensure you have MongoDB running or a connection string in `.env`.

3. **Start the app**
   ```bash
   npx expo start
   ```

4. **Scan the QR Code**: Use the Expo Go app (Android) or Camera app (iOS) to run the app on your device.

### Resetting the Project

If you need a fresh slate during development:
```bash
npm run reset-project
```

---

## 📂 Project Structure

```bash
habitro/
├── app/                 # Expo Router screens
│   ├── (tabs)/          # Main tab navigation (Home, Editor, Analytics, Settings)
│   ├── login.tsx        # Authentication screens
│   └── _layout.tsx      # Root layout & Splash screen logic
├── assets/              # Images, fonts, and icons
├── src/
│   ├── components/      # Reusable UI components (Logo, Cards, Charts)
│   ├── store/           # Zustand state stores (Auth, Routine)
│   ├── theme/           # Design tokens (Colors, Spacing, Typography)
│   └── utils/           # Helper functions (Dates, Streaks)
├── server/              # Express backend & Seed scripts
└── scripts/             # Utility scripts (Icon generation, etc.)
```

---

## 📱 Building for Android

To build an APK for testing or release:

```bash
eas build -p android --profile preview
```

or for a local build (if configured):

```bash
npx expo run:android
```

See [BUILD_APK.md](./BUILD_APK.md) for detailed instructions on generating a signed APK.

---

## 📄 License

This project is licensed under the MIT License.
