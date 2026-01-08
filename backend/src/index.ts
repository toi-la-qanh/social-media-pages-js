import { config } from '@dotenvx/dotenvx';
config({ path: ['.env'], ignore: ['MISSING_ENV_FILE'] });

import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json({ limit: '1kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1kb' }));

import hpp from 'hpp';
app.use(hpp());

// Middleware
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// app.set("trust proxy", 3);
const PORT = Number(process.env.PORT);
const server = http.createServer(app);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

/* Language Translation Setup */
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "vi"],
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}.json"),
    },
    detection: {
      order: ["querystring", "cookie", "header"],
      lookupQuerystring: "lang",
      caches: ["cookie"],
      cookieOptions: {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.sameSite,
        cookieDomain: process.env.cookieDomain, // for production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    },
  });

app.use(i18nextMiddleware.handle(i18next));

/* Initialize socket.io */
import SocketController from "./socket/socket.controller";
new SocketController(server);

// Generate some fake data
import IndexFactory from './database/factories/index.factories';
IndexFactory.run(false);

// Routes 
import IndexRoutes from './routes/index.routes';

const indexRoutes = new IndexRoutes();
app.use(indexRoutes.getUrl(), indexRoutes.getRouter());

export { app, server };