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
const server = http.createServer(app);
let PORT = Number(process.env.PORT) || 3000;
if (process.env.NODE_ENV === "test") {
  PORT = 5000;
}
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

/* Language Translation Setup */
import i18nextMiddleware from "i18next-http-middleware";
import { i18n, initI18n } from "./locales/index.locales";

void initI18n();
app.use(i18nextMiddleware.handle(i18n));

/* Initialize socket.io */
import SocketController from "./socket/socket.controller";
new SocketController(server);

// Generate some fake data
// import IndexFactory from './database/factories/index.factories';
// IndexFactory.run(false);

// Routes 
import IndexRoutes from './routes/index.routes';

const indexRoutes = new IndexRoutes();
app.use(indexRoutes.getUrl(), indexRoutes.getRouter());

export { app, server };