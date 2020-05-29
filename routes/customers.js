const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');

router.get('/', async (req, res) => {

    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    }catch(ex) {
        res.status(404).send({message: 'An error has been ocurred!'})
        console.log(ex.message);
    }

});

router.get('/:id', async (req, res) => {

    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send({message: 'The customer with the given id was not found!'});
        res.send(customer);
    }catch(ex) {
        res.status(404).send({message: 'An error has been ocurred getting the customer!'})
        console.log(ex.message);
    }
    
});

router.post('/', async (req, res) => {
    const body = req.body;

    const {error} = validate(body);

    if (error) return res.status(404).send(error.details[0].message);

    try {

        let customer = new Customer({
            isGold: body.isGold,
            name: body.name,
            phone: body.phone
        });    

        customer = await customer.save();
        res.send(customer);
    }catch(ex) {
        res.status(404).send({message: 'An error has been ocurred creating the customer!'})
        console.log(ex.message);
    }

});

router.put('/:id', async (req, res) => {
    const body = req.body;
    
    const {error} = validate(body);

    if (error) return res.status(404).send(error.details[0].message);

    try {
            
        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            isGold: body.isGold,
            name: body.name,
            phone: body.phone
        }, { new: true });

        if (!customer) return res.status(404).send({message: 'The customer with the given id was not found!'});

        res.send(customer);

    }catch(ex) {
        res.status(404).send({message: ''})
        console.log(ex.message);
    }
});

router.delete('/:id', async (req, res) => {

    try {

        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer) return res.status(404).send({message: 'The customer with the given id was not found!'});

        res.send(customer);
    }catch(ex) {
        res.status(404).send({message: 'An error has been ocurred deleting the customer!'})
        console.log(ex.message);
    }
});


module.exports = router;