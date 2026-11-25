# VHERO - Frontend

React Native (Expo) app for VHERO.

## Project Structure

- `api/` - API-related files (calls to the backend)
- `app/` - Screens and app entry files (e.g., `index.tsx`, `_layout.tsx`)
- `constants/` - Constant values (e.g., `MINUTES_TO_RESEND_OTP`)

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in an Android emulator, iOS simulator, Expo Go, or the web.

> Make sure the backend is running (see the VHERO Backend README) and the API base URL in `api/` points to it. On a physical device, use your machine's local IP instead of `localhost`.
