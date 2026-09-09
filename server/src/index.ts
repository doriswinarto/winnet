import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config.js';
import { unmatchedFields } from './fields.js';
import { authRouter } from './routes/auth.js';
import { dataRouter } from './routes/data.js';
import { pengaturanRouter } from './routes/pengaturan.js';
import { tulisRouter } from './routes/tulis.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.disable('x-powered-by');
if (config.trustProxy > 0) app.set('trust proxy', config.trustProxy);

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Customer data must never be cached by a proxy or the browser's back button.
app.use('/bff', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/bff/sehat', (_req, res) => res.json({ ok: true }));

/**
 * Which normalizer fields have not matched a panel key yet. Useful when first
 * pointing this at a real panel; it names exactly what to correct in
 * normalize.ts. Deliberately reveals no customer data.
 */
app.get('/bff/diagnostik', (_req, res) => {
  res.json({ unmatchedFields: unmatchedFields() });
});

app.use('/bff', pengaturanRouter);
app.use('/bff', authRouter);
app.use('/bff', dataRouter);
app.use('/bff', tulisRouter);

app.use('/bff', (_req, res) => res.status(404).json({ error: 'Not found' }));

// The SPA is served from this same origin, which is what lets the session live
// in a SameSite=Strict cookie with no CORS surface at all.
const staticDir = path.resolve(here, '..', config.staticDir);
app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'), (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(config.port, () => {
  console.log(
    `portal node on :${config.port} → ${config.panelBaseUrl}` +
      (config.secureCookies ? '' : '  [WARNING: Secure cookies disabled]'),
  );
});
