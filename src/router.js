const { Router } = require('express');
const ServiceController = require('./app/controllers/ServiceController');

const router = Router();

router.get('/services', ServiceController.index);
router.post('/services', ServiceController.store);

module.exports = router;
