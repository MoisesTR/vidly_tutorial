const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean,
    roles: [],
    operations: []
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token; 
};

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

module.exports = {
    User,
    userSchema,
    validate
}