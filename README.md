# Interactly backend task

## Configuration

Secrets are read from environment variables (or a local `.env` file, which is git-ignored):

```sh
cp .env.example .env   # then fill in your Freshworks API key/domain and MySQL credentials
npm install
npm start
```

Required: `FRESHWORKS_DOMAIN`, `FRESHWORKS_API_KEY` (the server exits with an error if they are missing).
Optional: `PORT` (default 3000), `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
