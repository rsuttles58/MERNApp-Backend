const uuid = require("uuid/v4");
const HTTPError = require("../models/http-error");
const { validationResult } = require("express-validator");
let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Dean Sanders',
        email: 'test@test.com',
        password: 'testers'
    }
];

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS});
};

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HTTPError('Could not identify user', 401)
    }
    res.json({message: 'Logged in.'})
};

const signup = (req, res, next) => {
    //Ensure user has signed up correctly.  If not, throw a 422 error.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HTTPError('Invalid inputs passed.  Check data', 422);
    }

    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser){
        throw new HTTPError('Count not create user, email already exists.', 422);
    }

    const createUser = {
        id: uuid(),
        name, //shorthand for name: name
        email,
        password
    }

    DUMMY_USERS.push(createUser);
    res.status(201).json({user: createUser});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
