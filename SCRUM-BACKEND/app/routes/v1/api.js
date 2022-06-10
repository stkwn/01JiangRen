const express = require('express');
const router =  new express.Router();
const weatherController = require('../../controllers/weather');

router.get('/weather', weatherController.index);

module.exports = router;