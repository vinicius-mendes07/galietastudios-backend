const ScheduleRepository = require('../repositories/ScheduleRepository');
const ServiceRepository = require('../repositories/ServiceRepository');
const UserRepository = require('../repositories/UserRepository');
const dateHasPassed = require('../utils/dateHasPassed');
const isValidUUID = require('../utils/isValidUUID');
const sumTime = require('../utils/sumTime');

const user_id = process.env.USER_ID;

class ScheduleControler {
  async index(req, res) {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const ISODate = currentDate.toISOString();

    const dateOnly = ISODate.split('T')[0];

    const schedules = await ScheduleRepository.findAll(dateOnly);

    res.json(schedules);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid schedule id' });
    }

    const schedule = await ScheduleRepository.findById(id);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  }

  async getPendings(req, res) {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const ISODate = currentDate.toISOString();

    const dateOnly = ISODate.split('T')[0];

    const schedules = await ScheduleRepository.findByPending(dateOnly);

    res.json(schedules);
  }

  async getConfirmed(req, res) {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const ISODate = currentDate.toISOString();

    const dateOnly = ISODate.split('T')[0];

    const schedules = await ScheduleRepository.findByConfirmed(dateOnly);

    res.json(schedules);
  }

  async store(req, res) {
    const {
      name,
      phone,
      email,
      schedule_date,
      hour,
      service_id,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!schedule_date) return res.status(400).json({ error: 'Schedule date is required' });
    if (!hour) return res.status(400).json({ error: 'Password is required' });

    if (!isValidUUID(service_id)) return res.status(400).json({ error: 'Invalid service id' });
    if (!isValidUUID(user_id)) return res.status(400).json({ error: 'Invalid user id' });

    if (dateHasPassed(schedule_date)) {
      return res.status(400).json({ error: 'This date has passed' });
    }

    const service = await ServiceRepository.findById(service_id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const userExists = await UserRepository.findById(user_id);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userExists && userExists.email === email) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    const scheduleDateNotAvailable = await ScheduleRepository.findByDateNotAvailable(schedule_date);

    if (scheduleDateNotAvailable) {
      return res.status(400).json({ error: 'This date is not available' });
    }

    const scheduleExists = await ScheduleRepository.findByDateAndHour({
      schedule_date,
      hour,
      user_id,
    });

    if (scheduleExists) {
      return res.status(400).json({ error: 'This date and time is already scheduled' });
    }

    const hour_end = sumTime(hour, service.duration);

    const schedule = await ScheduleRepository.create({
      name,
      phone,
      email,
      schedule_date,
      hour,
      hour_end,
      service_id,
      user_id,
    });

    res.status(201).json(schedule);
  }

  async confirmPending(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid schedule id' });
    }

    const scheduleExists = await ScheduleRepository.findById(id);

    if (!scheduleExists) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const confirmedSchedule = await ScheduleRepository.confirmSchedule(id, { status: status || 'confirmado' });

    res.json(confirmedSchedule);
  }

  async cancelDay(req, res) {
    const { schedule_date } = req.body;

    if (!schedule_date) {
      return res.status(400).json({ error: 'Date to cancel is required' });
    }

    const schedules = await ScheduleRepository.findByDay(schedule_date);

    if (schedules.length > 0) {
      return res.status(400).json({ error: 'There is schedules in this date' });
    }

    const service_id = 'f8f49f23-8e06-48e5-9b23-5d93ffc992f9';

    if (!isValidUUID(service_id)) return res.status(400).json({ error: 'Invalid service id' });

    const service = await ServiceRepository.findById(service_id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    const hour = '00:00';
    const hour_end = sumTime(hour, service.duration);

    const dayCanceled = await ScheduleRepository.cancelDay({
      name: 'cancelado',
      phone: '123456789',
      email: 'cancelado@email.com',
      schedule_date,
      hour,
      hour_end,
      available: false,
      service_id,
      user_id,
    });

    res.json(dayCanceled);
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      name,
      phone,
      email,
      schedule_date,
      hour,
      service_id,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!schedule_date) return res.status(400).json({ error: 'Schedule date is required' });
    if (!hour) return res.status(400).json({ error: 'Password is required' });

    if (!isValidUUID(id)) return res.status(400).json({ error: 'Invalid schedule id' });
    if (!isValidUUID(service_id)) return res.status(400).json({ error: 'Invalid service id' });
    if (!isValidUUID(user_id)) return res.status(400).json({ error: 'Invalid user id' });

    if (dateHasPassed(schedule_date)) {
      return res.status(400).json({ error: 'This date has passed' });
    }

    const service = await ServiceRepository.findById(service_id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const userExists = await UserRepository.findById(user_id);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userExists && userExists.email === email) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    const scheduleExists = await ScheduleRepository.findById(id);

    if (!scheduleExists) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const scheduleByDateAndHour = await ScheduleRepository.findByDateAndHour({
      schedule_date,
      hour,
      user_id,
    });

    if (scheduleByDateAndHour && scheduleByDateAndHour.id !== id) {
      return res.status(400).json({ error: 'This date and time is already scheduled' });
    }

    const hour_end = sumTime(hour, service.duration);

    const schedule = await ScheduleRepository.update(id, {
      name,
      phone,
      email,
      schedule_date,
      hour,
      hour_end,
      service_id,
      user_id,
    });

    res.status(201).json(schedule);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid schedule id' });
    }

    await ScheduleRepository.delete(id);
    res.sendStatus(204);
  }
}

module.exports = new ScheduleControler();
