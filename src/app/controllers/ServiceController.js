const ServiceRepository = require('../repositories/ServiceRepository');

class ServiceController {
  async index(req, res) {
    const services = await ServiceRepository.findAll();

    res.json(services);
  }

  async store(req, res) {
    const { service_type, duration } = req.body;

    if (!service_type) {
      return res.status(400).json({ error: 'service type is required' });
    }

    if (!duration) {
      return res.status(400).json({ error: 'duration is required' });
    }
    if (duration !== 30 && duration !== 60) {
      return res.status(400).json({ error: 'duration must be 30 or 60' });
    }

    const service = await ServiceRepository.create({ service_type, duration });

    res.status(201).json(service);

    res.send('post /services');
  }
}

module.exports = new ServiceController();
