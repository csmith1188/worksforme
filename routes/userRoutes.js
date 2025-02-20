const express = require('express');
const router = express.Router();
const redirectWhenDone = require('../middleware/redirect');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/login', (req, res) => {
    res.render('pages/loginSystem/login');
});

router.get('/WFMlogin', userController.wmLogin);
router.post('/WFMlogin', userController.postwmLogin);

router.get('/register', userController.registerNewUser);
router.post('/register', userController.postRegisterNewUser);

router.post('/userExists', userController.userExists);

router.get('/calendar', auth, userController.calendarPage);

router.get('/formbar', userController.formbar, redirectWhenDone);
router.get('/logout', userController.logout, auth, redirectWhenDone);

router.get('/inbox', auth, userController.inboxPage);
router.post('/inbox', auth, userController.postInboxPage);

module.exports = router;