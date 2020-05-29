const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const { User, validate} = require('../models/user');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);

});

router.get('/', async (req, res) => {
    
    try {
        const users = await User.find().sort('name');
        res.send(users);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'An error has ocurred getting the users!'});
    }
});

// router.get('/:id', async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) return res.status(400).send({message: 'The user with the given id was not found!'});

//     try {
        
//         res.send(user);
//     }catch(ex) {
//         console.log(ex.message);
//         res.status(400).send({message: 'An error has ocurred getting the user!'});
//     }
// });

router.post('/', async (req, res) => {
    const body = req.body;

    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: body.email});
    if (user) return res.status(400).send('User already registered!');

    try {

        const user = new User(_.pick(body, ['name', 'email', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'An error has ocurred getting the user!'});
    }
});

// Information Expert Principle

router.put('/:id', async (req, res) => {
    const body = req.body;

    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);
    

    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: body.name,
            email: body.email,
            password: body.password
        }, {new: true});
        
        if (!user) return res.status(400).send({message: 'The user with the given id was not found!'});

        res.send(user);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'An error has ocurred getting the user!'});
    }
});

router.delete('/:id', async (req, res) => {
    
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(400).send({message: 'The user with the given id was not found!'});
        res.send(user);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'An error has ocurred getting the user!'});
    }
});

module.exports = router;