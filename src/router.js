const { Router } = require('express');
const ServiceController = require('./app/controllers/ServiceController');

const router = Router();

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.post('/services', ServiceController.store);
router.put('/services/:id', ServiceController.update);

module.exports = router;
