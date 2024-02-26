const ScheduleRepository = require('../repositories/ScheduleRepository');
const ServiceRepository = require('../repositories/ServiceRepository');
const UserRepository = require('../repositories/UserRepository');

const sendEmail = require('../services/emailService');

const getCurrentDate = require('../utils/getCurrentDate');
const dateHasPassed = require('../utils/dateHasPassed');
const isValidUUID = require('../utils/isValidUUID');
const sumTime = require('../utils/sumTime');
const getDateAndHourPortugalTimeZone = require('../utils/getDateAndHourPortugalTimeZone');

const user_id = process.env.USER_ID;

class ScheduleControler {
  async index(req, res) {
    const { date } = req.query;
    const currentDate = getCurrentDate();

    const schedules = await ScheduleRepository.findAll(currentDate, date);

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

  async getCanceled(req, res) {
    const currentDate = getCurrentDate();

    const canceledDays = await ScheduleRepository.findCanceledDays(currentDate);

    res.json(canceledDays);
  }

  async getPendings(req, res) {
    const currentDate = getCurrentDate();

    const schedules = await ScheduleRepository.findByPending(currentDate);

    res.json(schedules);
  }

  async getConfirmed(req, res) {
    const currentDate = getCurrentDate();

    const schedules = await ScheduleRepository.findByConfirmed(currentDate);

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
      return res.status(400).json({ error: 'This date and time is not available' });
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

    const {
      dateInPortugal,
      hourInPortugal,
    } = getDateAndHourPortugalTimeZone(schedule.schedule_date, schedule.hour);

    sendEmail({
      subject: 'Agendamento solicitado com sucesso',
      message: `
      Você solicitou um agendamento na Galieta Barber Shop.
      Data: ${dateInPortugal}
      Hora: ${hourInPortugal}
      Serviço: ${service.service_type}
      `,
    })
      .then((info) => console.log('E-mail sent: ', info.response))
      .catch((error) => console.log('Error to send email: ', error))
      .finally(() => {
        sendEmail({
          subject: 'Nova solicitação de agendamento',
          message: `
          Há um cliente solicitando agendamento.
          Data: ${dateInPortugal}
          Hora: ${hourInPortugal}
          nome: ${schedule.name}
          telefone: ${schedule.phone}
          email: ${schedule.email}
          Serviço: ${service.service_type}`,
        })
          .then((info) => console.log('E-mail sent: ', info.response))
          .catch((error) => console.log('Error to send email: ', error));
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

    if (scheduleExists.status === 'confirmado') {
      return res.status(400).json({ error: 'This schedule is already confirmed' });
    }

    const confirmedSchedule = await ScheduleRepository.confirmSchedule(id, { status: status || 'confirmado' });

    const {
      dateInPortugal,
      hourInPortugal,
    } = getDateAndHourPortugalTimeZone(confirmedSchedule.schedule_date, confirmedSchedule.hour);

    sendEmail({
      subject: 'Agendamento confirmado!',
      message: `
        Seu agendamento na Galieta Barber Shop foi confirmado!
        Data: ${dateInPortugal}
        Hora: ${hourInPortugal}
        Serviço: ${scheduleExists.service_type}
      `,
    })
      .then((info) => console.log('E-mail sent: ', info.response))
      .catch((error) => console.log('Error to send email: ', error));

    res.json(confirmedSchedule);
  }

  async cancelDay(req, res) {
    const { schedule_date } = req.body;

    if (!schedule_date) {
      return res.status(400).json({ error: 'Date to cancel is required' });
    }

    const schedule = await ScheduleRepository.findByDay(schedule_date);

    if (schedule) {
      if (schedule.available) {
        return res.status(400).json({ error: 'There is schedules in this date' });
      }
      return res.status(400).json({ error: 'This date is already canceled' });
    }

    const [service] = await ServiceRepository.findAll();

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
      service_id: service.id,
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

    const scheduleExists = await ScheduleRepository.findById(id);

    if (!scheduleExists) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    await ScheduleRepository.delete(id);

    const {
      dateInPortugal,
      hourInPortugal,
    } = getDateAndHourPortugalTimeZone(scheduleExists.schedule_date, scheduleExists.hour);

    if (scheduleExists.available) {
      sendEmail({
        subject: 'Agendamento cancelado',
        message: `
          Infelizmente, seu agendamento para a data ${dateInPortugal} as ${hourInPortugal} foi cancelado.
          Você pode fazer um novo agendamento no nosso site: [endereco.site.com]/agendar
        `,
      })
        .then((info) => console.log('E-mail sent: ', info.response))
        .catch((error) => console.log('Error to sent email: ', error));
    }

    res.sendStatus(204);
  }
}

module.exports = new ScheduleControler();
