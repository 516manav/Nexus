import express from "express";
import { Server } from "socket.io";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from 'passport-google-oauth2';

env.config();
const app = express();
const port = 8080;
const salt_rounds = 12; 
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use((req, res, next) => {
    if(req.isAuthenticated()) {
        const oldSessionData = req.session;
        req.session.regenerate( err => {
            if(err)
            return next(err, 'Not able to regenerate session ID');
            Object.assign(req.session, oldSessionData);
            next();
        });
    }else
    next();
});

app.use( (err, info, req, res, next) => {
    console.log("Error handling middleware");
    res.send({ ...err, additionalErrorInfo: info});
});

const server = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const user = {};

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("new-user", userName => {
        user[socket.id]=userName;
        socket.broadcast.emit("user-connected", userName+" joined.");
    });

    socket.on("send-chat-message", (message) => {
        socket.broadcast.emit("receive-chat-message", user[socket.id]+": "+message);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", user[socket.id]+" disconnected.");
        delete user[socket.id];
    })
});

app.get('/auth/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'], state: JSON.stringify(req.query.remember) })(req, res, next);
});

app.get('/auth/google/nexus', (req, res, next) => {
    const rememberMe = JSON.parse(req.query.state || '');
    passport.authenticate('google', (err, user) => {
        if(err)
        return next(err, 'Failed to login using google oauth');
        
        req.login(user, (e) => {
            if(e)
            return next(e, 'Failed to create a cookie after google oauth athourization');
            if(rememberMe === 'true')
            req.session.cookie.maxAge = 1000*60*60*24*30;
            res.redirect('http://localhost:3000/chat');
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout(err => {
        if(err)
        return res.send({result: false});
        req.session.destroy(e => {
            if(e)
            next(e, 'Error destroying the user session');
            res.clearCookie('connect.sid');
            return res.send({result: true});
        })
    });
});

app.post('/register', async (req, res) => {
    bcrypt.hash(req.body.password, salt_rounds, async (err, hash) =>{
        if(err){
            next(err, 'Error in hashing the password using bcrypt.');
        }else{
            try{
                await db.query("INSERT INTO users (email, password, username, status) VALUES ($1, $2, $3, $4)", [req.body.email, hash, req.body.username, req.body.status]);
            }catch(e){
                next(err, 'Error in inserting the user details in database.')
            }
        }
    });
});

app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user) => {
        if(err)
        return res.send({message: 'user-not-registered'});
        else if(!user)
        return res.send({message: 'login-failure'});
        req.login(user, (err) => {
            if(err) {
                return res.send({message: 'failure-creating-cookie'});
            }
            if(req.body.remember)
                req.session.cookie.maxAge = 1000*60*60*24*30;
            return res.send({message: 'success'});
        });
    })(req, res);
});

app.get("/authenticate", (req, res) => {
    res.send({result: req.isAuthenticated()});
});

passport.use("local", new Strategy({
        usernameField: 'email',
        passwordField: 'password' 
    }, async function verify(email, password, cb) {
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(result.rows.length === 0)
            return cb(new Error("User not registered"));
        else{
            const user = {
                email: result.rows[0].email,
                username: result.rows[0].username,
                id: result.rows[0].id
            }
            bcrypt.compare(password, result.rows[0].password, (err, match) => {
                if(err){
                    return next(err, 'Error in trying to compare passwords using bcrypt.');
                }else{
                    if(match)
                    return cb(null, user);
                    else
                    return cb(null, false);
                }
            });
        }
    }catch(e){
        return next(e, 'Unexpected Error while authenticating user using local strategy.');
    }
}));

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/nexus",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
        if(result.rows.length === 0){
            const newUser = await db.query("INSERT INTO users (email, password, username, status) VALUES ($1, $2, $3, $4) RETURNING (email, id, username)", [profile.email, 'google', profile.displayName, 'Available']);
            cb(null, newUser);
        }
        else{
            const user = {
                email: result.rows[0].email,
                username: result.rows[0].username,
                id: result.rows[0].id
            }
            cb(null, user);            
        }
    }catch(e){
        return next(e, 'Unexpected Error while logging user in using google oauth.');
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});