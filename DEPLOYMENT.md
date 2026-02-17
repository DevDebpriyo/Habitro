# Deployment Guide: Professional & Universal Access

To make your app "universal" (accessible to anyone, anywhere, 24/7) and independent of your PC, you must deploy the Backend and Frontend to the cloud.

## 1. Deploy Backend (API)
We will use **Render.com** (Free Tier) to host the Node.js server.

### Steps:
1.  **Push your code to GitHub** (if not already).
2.  **Sign up for Render** (https://render.com) and connect your GitHub account.
3.  Click **New +** -> **Web Service**.
4.  Select your repository (`app1`).
5.  Configure the service:
    -   **Name**: `habit-tracker-api` (or similar)
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server/server.js`
6.  **Environment Variables** (Scroll down to "Advanced"):
    -   Key: `DATABASE_URL`
        -   Value: `mongodb+srv://Noel:Iamnoel123@habittracker.lwatzri.mongodb.net/?appName=HabitTracker` (From your .env)
    -   Key: `JWT_SECRET`
        -   Value: (Create a secure random string, e.g. `mySuperSecretKey123!`)
7.  Click **Create Web Service**.
8.  Wait for deployment. You will get a URL like `https://habit-tracker-api.onrender.com`.

## 2. Connect Frontend to Backend
Once your backend is live (e.g., `https://habit-tracker-api.onrender.com`):

1.  Open `.env` in your project.
2.  Update `EXPO_PUBLIC_API_URL`:
    ```ini
    EXPO_PUBLIC_API_URL=https://habit-tracker-api.onrender.com
    ```
3.  Restart your app (`npm start`, then press `r`).

## 3. Deploy Frontend (Optional)
To share the app as an installed app (not Expo Go):

1.  Update `app.json` with a unique bundle ID (e.g. `com.yourname.habittracker`).
2.  Run `eas build --platform android --profile preview` (requires EAS CLI).
3.  Share the `.apk` file or upload to Play Store.

## Why "Unknown Error"?
If you see network errors locally:
1.  Ensure your phone and PC are on the **Same Wi-Fi**.
2.  Ensure **Firewall** allows Node.js on port 3001.
3.  For immediate global access without deployment, use **ngrok**: `npx ngrok http 3001`.
