const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const redirectWhenDone = require('../middleware/redirect');

router.get('/login', (req, res) => {
    res.render('pages/login');
});
router.get('/formbar', userController.formbar, redirectWhenDone);
router.get('/logout', userController.logout);

module.exports = router;