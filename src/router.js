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

// router.get('/users', UserController.index);
router.get('/users/:id', authService, UserController.show);
// router.post('/users', UserController.store);
router.post('/users/login', UserController.login);
router.put('/users/current', authService, UserController.update);
// router.delete('/users/:id', UserController.delete);

router.get('/schedules', ScheduleController.index);
router.get('/schedules/schedules-and-canceled-days', ScheduleController.getSchedulesAndCanceledDays);
router.get('/schedules/pending', authService, ScheduleController.getPendings);
router.get('/schedules/canceled', ScheduleController.getCanceled);
router.get('/schedules/confirmed', authService, ScheduleController.getConfirmed);
router.get('/schedules/:id', authService, ScheduleController.show);
router.post('/schedules/cancel-day', authService, ScheduleController.cancelDay);
router.post('/schedules', ScheduleController.store);
router.patch('/schedules/confirm/:id', authService, ScheduleController.confirmPending);
router.put('/schedules/:id', authService, ScheduleController.update);
router.delete('/schedules/:id', authService, ScheduleController.delete);

module.exports = router;
