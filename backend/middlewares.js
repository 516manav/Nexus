export function applyMiddleware(app) {
    
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });

    app.use((req, res, next) => {
        if(req.isAuthenticated()) {
            const oldSessionData = req.session;
            req.session.regenerate(err => {
                if(err)
                    return next(err);
                Object.assign(req.session, oldSessionData);
                next();
            });
        } else {
            next();
        }
    });

    app.use((err, info, req, res, next) => {
        console.log("Error Handling Middleware");
        res.send({...err, additionalErrorInfo: info});
    });
}