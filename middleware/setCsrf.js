module.exports = (req, res, next) => {
    const skipPaths = ['/refresh-token'];

    if ((req.method === 'GET' || req.method === 'HEAD')
        && !skipPaths.includes(req.path)) {    
        
        try {
            if (!res.locals.csrfToken){
            res.locals.csrfToken = req.csrfToken();
            console.log('CSRF Token: ' + res.locals.csrfToken);
            }
        } catch (err) {
            console.error('CSRF token error: ', err);
        }
    }
    next();
}