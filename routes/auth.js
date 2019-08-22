const router = require('express').Router();
const User = require('./model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');


//register
router.post('/register', async(req, res) => {

//Validating the inputs before creating a user
//const {error} = Joi.validate(req.body, schema);
const {error} = registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message)
//res.send(error.details[0].message);

//check if user exits
const emailExits = await User.findOne({email: req.body.email});
if(emailExits) return res.status(400).send('Email already registered');


//Hash the password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);


//create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
       // res.send(savedUser);
       res.send({user: user._id});
    }catch(err){
        res.send(400).send(err);
    }
}); 


//login

router.post('/login', async(req, res) => {
    //Validating the inputs before creating a user
//const {error} = Joi.validate(req.body, schema);
const {error} = loginValidation(req.body);
if(error) return res.status(400).send(error.details[0].message)
//check if email exits
const user = await User.findOne({email: req.body.email});
if(!user) return res.status(400).send('Email is not found');

//Password is correct
const validPass = await bcrypt.compare(req.body.password, user.password);
if(!validPass) return res.status(400).send('Invalid password');


//Create and assign a token
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
res.header('auth_token', token).send(token);

//res.send('Login successfull');
});

module.exports = router;