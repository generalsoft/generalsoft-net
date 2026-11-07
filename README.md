# Generalsoft Website

Marketing site for **generalsoft.net** — built with [Astro](https://astro.build) + Tailwind CSS.
The contact form writes submissions straight to **Cloud Firestore** from the browser.

## Local development

```bash
npm install
cp .env.example .env   # then fill in your Firebase web config
npm run dev            # http://localhost:4321
```

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server                     |
| `npm run build`   | Build the static site into `dist/`       |
| `npm run preview` | Preview the production build locally     |
| `npm run deploy:rules` | Deploy `firestore.rules` to the Firebase project (`.firebaserc`) |

## Contact form → Firebase

`src/components/Contact.astro` renders the form (name, email, phone *(optional)*,
company *(optional)*, interest, message) and `src/lib/firebase.ts` writes each
submission to the `contactMessages` Firestore collection:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+971 50 123 4567",
  "company": "Acme FZ-LLC",
  "interest": "custom-software",
  "message": "We need a maintenance app…",
  "status": "new",
  "source": "website-contact-form",
  "createdAt": "<server timestamp>"
}
```

### 1. Firebase console setup

1. Open the **Firebase console → Project settings → General → Your apps → Web app**
   and copy the SDK config values.
2. Make sure **Firestore Database** is created for the project (Build → Firestore Database).
3. Put the values in `.env` (locally) and in the repository secrets (for CI), using these names:

   ```
   PUBLIC_FIREBASE_API_KEY
   PUBLIC_FIREBASE_AUTH_DOMAIN
   PUBLIC_FIREBASE_PROJECT_ID
   PUBLIC_FIREBASE_STORAGE_BUCKET
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   PUBLIC_FIREBASE_APP_ID
   PUBLIC_FIREBASE_MEASUREMENT_ID   # optional, only used for Analytics
   ```

   These are the public web SDK values — they are meant to be shipped to the
   browser. Never place Admin SDK / service-account credentials in `PUBLIC_*` variables.

### 2. Deploy the security rules

`firestore.rules` allows anonymous visitors to **create** a validated
`contactMessages` document and blocks all reads/updates/deletes from the client.
Read submissions in the Firebase console (or with the Admin SDK).

```bash
npx firebase-tools deploy --only firestore:rules --project <your-project-id>
# or, with the project pinned in .firebaserc:
npm run deploy:rules
```

> Without these rules the default "deny all" policy applies and the form will
> report an error instead of saving.

## Deployment — GitHub Pages + custom domain

`.github/workflows/deploy.yml` runs on every push to `main` (and on manual
dispatch):

1. Installs dependencies with `npm ci`.
2. Fails fast if any required `PUBLIC_FIREBASE_*` secret is missing.
3. Builds the site with `npm run build`, injecting the secrets as environment variables.
4. Publishes `dist/` to GitHub Pages via `actions/deploy-pages`.

### Repository setup

1. Push this project to GitHub (default branch `main` — if yours is different,
   update `on.push.branches` in `.github/workflows/deploy.yml`).
2. **Settings → Secrets and variables → Actions → New repository secret** — add each
   `PUBLIC_FIREBASE_*` value from the Firebase console.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. **Settings → Pages → Custom domain:** `generalsoft.net`, then enable **Enforce HTTPS**
   once the certificate is issued (GitHub provisions it automatically after DNS resolves).
   The domain is also committed as `public/CNAME`, so every deployment keeps it.

### DNS records at your domain registrar

| Type    | Name  | Value                                         |
| ------- | ----- | --------------------------------------------- |
| `A`     | `@`   | `185.199.108.153`                             |
| `A`     | `@`   | `185.199.109.153`                             |
| `A`     | `@`   | `185.199.110.153`                             |
| `A`     | `@`   | `185.199.111.153`                             |
| `CNAME` | `www` | `<github-user>.github.io`                     |

(Optional IPv6: `AAAA @ 2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`.)

## Project structure

```
public/                 static assets (favicon, CNAME, .nojekyll)
src/components/         page sections, incl. Contact.astro (form)
src/layouts/Layout.astro
src/lib/firebase.ts     Firebase app + Firestore helpers for the contact form
src/pages/index.astro
firestore.rules         Firestore security rules for contactMessages
.github/workflows/      GitHub Pages deployment
```
