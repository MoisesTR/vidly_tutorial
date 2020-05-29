const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Api Genre');
    console.log('Welcome to Api Genre');
});

module.exports = router;