# Watchlist App

A simple React + TypeScript + Vite application that allows users to manage their watchlist of shows. Users can add/remove shows, confirm actions via modals, and enjoy internationalized support (English & German).

---

## Setup

1. Clone the repository

```bash
git clone https://github.com/magdalenapopeska/my-app.git
cd my-app
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The app should now be running on http://localhost:5173 (default Vite dev server port).

---

## Environment Variables

No special environment variables are required.  
If you later need to use an API key for TVmaze, create a `.env` file:

```env
VITE_TVMAZE_API_KEY=your_api_key_here
```

Vite requires the `VITE_` prefix for environment variables.

---

## API & Data Notes

- The app fetches show data from the [TVmaze API](https://www.tvmaze.com/api) using GET requests.  
- Adding/removing shows in your watchlist is handled locally in React state.  
- API quotas: TVmaze is free but has rate limits. Avoid sending too many requests too quickly.

---

## Tech Stack

- React (with TypeScript)  
- Vite for fast dev server and HMR  
- CSS Modules for styling  
- React-i18next for translations  
- React Router for navigation
