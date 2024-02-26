const { Router } = require('express');
const ScheduleController = require('./app/controllers/ScheduleController');
const ServiceController = require('./app/controllers/ServiceController');
const UserController = require('./app/controllers/UserController');
const authService = require('./app/services/authService');

const router = Router();

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.post('/services', authService, ServiceController.store);
router.put('/services/:id', authService, ServiceController.update);
router.delete('/services/:id', authService, ServiceController.delete);

router.get('/users', UserController.index);
router.get('/users/:id', authService, UserController.show);
router.post('/users', UserController.store);
router.post('/users/login', UserController.login);
router.put('/users/:id', authService, UserController.update);
router.delete('/users/:id', UserController.delete);

router.get('/schedules', ScheduleController.index);
router.get('/schedules/pending', ScheduleController.getPendings);
router.get('/schedules/canceled', ScheduleController.getCanceled);
router.get('/schedules/confirmed', ScheduleController.getConfirmed);
router.get('/schedules/:id', ScheduleController.show);
router.post('/schedules/cancel-day', ScheduleController.cancelDay);
router.post('/schedules', ScheduleController.store);
router.patch('/schedules/confirm/:id', ScheduleController.confirmPending);
router.put('/schedules/:id', ScheduleController.update);
router.delete('/schedules/:id', ScheduleController.delete);

module.exports = router;
