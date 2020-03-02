const express = require("express");
const usersControllers = require('../controllers/users-controller');
const { check } = require("express-validator");
const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/login', usersControllers.login);

//Validate that the client is signing up with a name of at least 3 characters
//that the email is an email and the password is not empty(not the best validation I know)
router.post('/signup', [
    check('name').isLength({min: 3}),
    check('email').isEmail(),
    check('password').not().isEmpty()
],usersControllers.signup);

module.exports = router;