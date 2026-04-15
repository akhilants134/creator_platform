# Production Readiness Checklist

## Environment Variables

- [ ] NODE_ENV=production set on hosting platform
- [ ] MONGO_URI set to production database
- [ ] JWT_SECRET set to a long, random value
- [ ] CLOUDINARY keys configured in production
- [ ] CLIENT_URL set to deployed frontend URL (no trailing slash)
- [x] .env is in .gitignore
- [x] .env.example committed to repository
- [ ] Verified no hardcoded secrets in tracked files and git history

## Security

- [x] CORS restricted by environment with strict origin allowlist in production
- [x] Production error responses hide detailed error messages
- [x] Application console.log usage replaced with structured logging
- [x] Redux DevTools disabled in production builds (N/A: Redux not used)
- [x] Passwords hashed with bcrypt
- [x] JWT tokens expire (JWT_EXPIRES_IN supported)
- [ ] npm audit run and high/critical vulnerabilities addressed

## Build Steps

- [x] npm run build completes with no errors in client
- [ ] Production build tested locally with serve/equivalent
- [ ] All API calls verified against production build
- [ ] SPA routing verified on page refresh in deployed/static setup
- [x] Runtime dependencies are in dependencies
- [x] devDependencies include nodemon, jest, eslint, and testing libraries
- [x] node_modules is listed in .gitignore
- [ ] End-to-end test of production build completed

## Notes

- Server runtime dependency audit still reports 2 high vulnerabilities (Cloudinary chain via cloudinary and multer-storage-cloudinary).
- Client runtime dependency audit was fixed and now reports 0 vulnerabilities.
- If any secret was ever committed (for example in .env files), rotate immediately and scrub git history.
