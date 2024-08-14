import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import GoogleStrategy from 'passport-google-oauth2';
import bcrypt from 'bcrypt';
import db from './db.js';
import config from "./config.js";

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, cb) => {
    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(result.rows.length === 0)
            return cb(new Error("User not registered"));
        const user = {
            email: result.rows[0].email, 
            username: result.rows[0].username,
            id: result.rows[0].id
        };
        bcrypt.compare(password, result.rows[0].password, (err, match) => {
            if(err)
                return cb(err);
            if(match)
                return cb(null, user);
            else 
                return cb(null, false);
        });
    } catch(e) {
        return cb(e);
    }
}));

passport.use('google', new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/nexus",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    }, async (accessToken, refreshToken, profile, cb) => {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
            if(result.rows.length === 0){
                const newUser = await db.query("INSERT INTO users (email, password, username, status) VALUES ($1, $2, $3, $4) RETURNING (email, id, username)", [profile.email, 'google', profile.displayName, 'Available']);
                cb(null, newUser.rows[0]);
            } else {
                const user = {
                    email: result.rows[0].email,
                    username: result.rows[0].username,
                    id: result.rows[0].id
                };
                cb(null, user);
            }
        } catch(e) {
            cb(e);
        }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});