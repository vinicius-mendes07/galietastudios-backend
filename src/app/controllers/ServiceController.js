const ScheduleRepository = require('../repositories/ScheduleRepository');
const ServiceRepository = require('../repositories/ServiceRepository');
const getCurrentDate = require('../utils/getCurrentDate');
const isValidUUID = require('../utils/isValidUUID');
const loggedUserIsAdministrator = require('../utils/loggedUserIsAdministrator');

class ServiceController {
  async index(req, res) {
    const services = await ServiceRepository.findAll();

    res.json(services);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    const service = await ServiceRepository.findById(id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  }

  async store(req, res) {
    const { service_type, duration } = req.body;
    const loggedUser = req.user;

    if (!service_type) {
      return res.status(400).json({ error: 'Service type is required' });
    }

    if (!duration) {
      return res.status(400).json({ error: 'Duration is required' });
    }
    if (duration !== 30 && duration !== 60) {
      return res.status(400).json({ error: 'Duration must be 30 or 60' });
    }

    if (!loggedUserIsAdministrator(loggedUser.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const serviceExists = await ServiceRepository.findByServiceType(service_type);

    if (serviceExists) {
      return res.status(400).json({ error: 'This service already exists' });
    }

    const service = await ServiceRepository.create({ service_type, duration });

    res.status(201).json(service);
  }

  async update(req, res) {
    const { id } = req.params;
    const { service_type, duration } = req.body;
    const loggedUser = req.user;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    if (!service_type) {
      return res.status(400).json({ error: 'service type is required' });
    }

    if (!duration) {
      return res.status(400).json({ error: 'duration is required' });
    }
    if (duration !== 30 && duration !== 60) {
      return res.status(400).json({ error: 'duration must be 30 or 60' });
    }

    if (!loggedUserIsAdministrator(loggedUser.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const serviceExists = await ServiceRepository.findById(id);

    if (!serviceExists) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const serviceByType = await ServiceRepository.findByServiceType(service_type);

    if (serviceByType && serviceByType.id !== id) {
      return res.status(400).json({ error: 'This service type already exists' });
    }

    const service = await ServiceRepository.update(id, { service_type, duration });

    res.json(service);
  }

  async delete(req, res) {
    const { id } = req.params;
    const loggedUser = req.user;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    if (!loggedUserIsAdministrator(loggedUser.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const currentDate = getCurrentDate();

    const hasSchedules = await ScheduleRepository.findByServiceId({ id, currentDate });

    if (hasSchedules.length > 0) {
      return res.status(400).json({ error: 'There are schedules in this service' });
    }

    await ServiceRepository.delete(id);

    res.sendStatus(204);
  }
}

module.exports = new ServiceController();
