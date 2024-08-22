import express from "express";
import session from "express-session";
import passport from "passport";
import { Server } from "socket.io";
import config from "./config.js";
import db from './db.js';
import { applyMiddleware } from './middlewares.js';
import './passport-setup.js';
import routes from './routes.js';
import socketSetup from './socket.js';

const app = express();
const port = config.PORT;

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

applyMiddleware(app);

app.use(routes);

const server = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketSetup(io, db);