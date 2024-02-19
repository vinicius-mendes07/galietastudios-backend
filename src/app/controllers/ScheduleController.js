const ScheduleRepository = require('../repositories/ScheduleRepository');
const ServiceRepository = require('../repositories/ServiceRepository');
const UserRepository = require('../repositories/UserRepository');
const dateHasPassed = require('../utils/dateHasPassed');
const isValidUUID = require('../utils/isValidUUID');
const sumTime = require('../utils/sumTime');

class ScheduleControler {
  async index(req, res) {
    const schedules = await ScheduleRepository.findAll();

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

    const user_id = '816218cb-9748-420c-90ec-2b53f58e0d60';

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

    const user_id = '816218cb-9748-420c-90ec-2b53f58e0d60';

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