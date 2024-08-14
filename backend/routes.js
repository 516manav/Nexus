import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import db from './db.js';
import config from './config.js';

const router = express.Router();

router.get('/auth/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.remember })(req, res, next);
});

router.get('/auth/google/nexus', (req, res, next) => {
    const rememberMe = req.query.state || '';
    passport.authenticate('google', (err, user) => {
        if(err)
            return next(err);
        req.login(user, e => {
            if(e)
                return next(e);
            if(rememberMe === 'true')
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
            res.redirect('http://localhost:3000/chat');
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if(err)
            return res.send({result: false});
        req.session.destroy(e => {
            if(e)
                return next(e);
            res.clearCookie('connect.sid');
            res.send({result: true});
        });
    });
});

router.post('/register', async (req, res, next) => {
    bcrypt.hash(req.body.password, config.SALT_ROUNDS, async (err, hash) => {
        if(err)
            return next(err);
        try{
            await db.query("INSERT INTO users (email, password, username, status) VALUES ($1, $2, $3, $4)", [req.body.email, hash, req.body.username, req.body.status]);
        }catch(e) {
            next(e);
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if(err)
            return res.send({message: 'user-not-registered'});
        if(!user)
            return res.send({message: 'login-failure'});
        req.login(user, err => {
            if(err)
                return res.send({message: 'failure-creating-cookie'});
            if(req.body.remember)
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
            res.send({message: 'success'});
        });
    })(req, res);
});

router.get('/authenticate', (req, res) => {
    res.send({result: req.isAuthenticated()});
});

export default router;