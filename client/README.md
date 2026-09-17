# Client

React frontend built with Vite.

## Scripts

From the `client/` directory:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Local Development

The app expects the API to be available at `http://localhost:5000` by default.

If you need a different backend URL, set:

```bash
VITE_API_URL=http://your-api-url
```

## Notes

- The frontend uses React Router for navigation.
- API requests go through `src/services/api.js`, which adds the JWT token from `localStorage` when present.
