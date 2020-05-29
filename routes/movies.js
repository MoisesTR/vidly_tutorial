const express = require('express');
const router = express.Router();
const { Movie, validate} = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    
    try {
        const movies = await Movie.find().sort('title');
        res.send(movies);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'Something has failed getting the movies!'});
    }

});

router.get('/:id', async (req, res) => {
    
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(400).send({message: 'The movie with the given id was not found!'});
        res.send(movie);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'Something has failed getting the movie!'});
    }
    
});

router.post('/', async (req, res) => {
    const body = req.body;
    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(body.genreId);
    if (!genre) return res.status(400).send({message: 'Invalid Genre!'});

    try {

        const movie = new Movie({
            title: body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: body.numberInStock,
            dailyRentalRate: body.dailyRentalRate
        });

        await movie.save();
        res.send(movie);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'Something has failed creating the movie!'});
    }
    
});

router.put('/:id', async (req, res) => {
    const body = req.body;
    const {error} = validate(body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(body.genreId);
    if (!genre) return res.status(400).send({message: 'Invalid Genre!'});

    console.log(genre);

    try {

        const movie = await Movie.findByIdAndUpdate(req.params.id, {
           title: body.title,
           genre: {
               _id: genre._id,
               name: genre.name
           },
           numberInStock: body.numberInStock,
           dailyRentalRate: body.dailyRentalRate
        }, {new: true});

        if (!movie) return res.status(400).send({message: 'The movie with the given id was not found!'});
        res.send(movie);

    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'Something has failed updating the movie!'});
    }
    
});

router.delete('/:id', async (req, res) => {
    
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        
        if (!movie) return res.status(400).send({message: 'The movie with the given id was not found!'});
        res.send(movie);
    }catch(ex) {
        console.log(ex.message);
        res.status(400).send({message: 'Something has failed deleting the movie!'});
    }
    
});

module.exports = router;