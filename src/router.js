const { Router } = require('express');
const ServiceController = require('./app/controllers/ServiceController');
const UserController = require('./app/controllers/UserController');

const router = Router();

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.post('/services', ServiceController.store);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.post('/users', UserController.store);

module.exports = router;
