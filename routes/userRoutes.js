const express = require('express');
const router = express.Router();
const redirectWhenDone = require('../middleware/redirect');

const userController = require('../controllers/userController');

router.get('/login', (req, res) => {
    res.render('pages/loginSystem/login');
});

router.get('/WFMlogin', userController.wmLogin);
router.post('/WFMlogin', userController.postwmLogin, redirectWhenDone);

router.get('/formbar', userController.formbar, redirectWhenDone);
router.get('/logout', userController.logout);

module.exports = router;