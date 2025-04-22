const urlHelper = require('../util/urlHelper');

function redirectWhenDone(req, res){
    const redirectURL = req.session.redirectURL;
    
    if(!redirectURL){
        res.redirect('/');
        return;
    }

    // Clear the redirectURL
    req.session.redirectURL = null;
    res.redirect(redirectURL);
}

module.exports = redirectWhenDone