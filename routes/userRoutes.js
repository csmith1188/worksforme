const express = require('express');
const router = express.Router();
const redirectWhenDone = require('../middleware/redirect');

const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

router.get('/login', (req, res) => {
    res.render('pages/loginSystem/login');
});

router.get('/WFMlogin', userController.wmLogin);
router.post('/WFMlogin', userController.postwmLogin, redirectWhenDone);

router.get('/register', userController.registerNewUser);
router.post('/register', userController.postRegisterNewUser);

router.post('/userExists', userController.userExists);

router.get('/formbar', userController.formbar, redirectWhenDone);

router.get('/logout', userController.logout, auth, redirectWhenDone);

module.exports = router;