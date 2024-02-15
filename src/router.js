const { Router } = require('express');
const ScheduleController = require('./app/controllers/ScheduleController');
const ServiceController = require('./app/controllers/ServiceController');
const UserController = require('./app/controllers/UserController');
const authService = require('./services/authService');

const router = Router();

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.post('/services', ServiceController.store);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

router.get('/users', UserController.index);
router.get('/users/:id', authService, UserController.show);
router.post('/users', UserController.store);
router.post('/users/login', UserController.login);
router.put('/users/:id', authService, UserController.update);
router.delete('/users/:id', UserController.delete);

router.get('/schedules', ScheduleController.index);
router.get('/schedules/:id', ScheduleController.show);
router.post('/schedules', ScheduleController.store);
router.put('/schedules/:id', ScheduleController.update);
// router.delete('/schedules/:id', ScheduleController.delete);

module.exports = router;
