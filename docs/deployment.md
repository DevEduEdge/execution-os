# Deployment

## 1. Create Services

1. Create a Firebase project and enable Google sign-in.
2. Create a Firebase service account for the API.
3. Create a MongoDB Atlas cluster.
4. Create two Vercel projects:
   - Web project root: `apps/web`
   - API project root: `apps/api`

## 2. API Environment Variables

Set these in the API Vercel project:

```text
MONGODB_URI=
CLIENT_ORIGIN=https://your-web-app.vercel.app
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ALLOW_SEED=false
DEMO_AUTH=false
```

## 3. Web Environment Variables

Set these in the web Vercel project:

```text
NEXT_PUBLIC_API_URL=https://your-api.vercel.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_DEMO_MODE=false
```

## 4. Build Commands

Web:

```bash
npm run build
```

API:

```bash
npm run build
```

## 5. Production Notes

- Keep `DEMO_AUTH=false` in production.
- Keep `ALLOW_SEED=false` unless you intentionally need reset access.
- Add MongoDB Atlas network access for Vercel.
- Add the Vercel web domain to Firebase authorized domains.
