const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        required: false,
        type: String,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', schema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50).required()

    });

    return schema.validate(customer);
}

module.exports = {
    Customer
    , validate : validateCustomer
}