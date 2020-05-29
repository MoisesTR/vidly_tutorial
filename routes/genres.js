const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    const genres = await Genre.find().sort('name');
    res.send(genres);
    
});

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given id was not found');
    res.send(genre);
}); 

router.post('/', auth, async (req, res) => {

    const body = req.body;
    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre();
    genre.name = body.name;
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOneAndUpdate({_id: id}, {name: body.name}, {new: true});

    if (!genre) return res.status(404).send('The genre with the given id was not found');
    res.send(genre);
    
    // const {error} = validateGenre(req.body);

    // if (error) return res.status(404).send(error.details[0].message);

    // genre.name = req.body.name;
    
});

router.delete('/:id', [auth, admin, validateObjectId], auth, async (req, res) => {
    const id = req.params.id;
    // const genre = findGenre(req.params.id);
    // if (!genre) return res.status(404).send('The genre with the given id was not found');

    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);
    // res.send(genre);
    const genre = await Genre.findByIdAndRemove(id);
    
    if (!genre) return res.status(404).send('The genre with the given id was not found');
    
    res.send(genre);
 
});

module.exports = router;