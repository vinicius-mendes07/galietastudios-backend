const cron = require('node-cron');

const ScheduleRepository = require('../repositories/ScheduleRepository');

const getDateAndHourPortugalTimeZone = require('../utils/getDateAndHourPortugalTimeZone');
const getCurrentDate = require('../utils/getCurrentDate');

const sendEmail = require('../services/emailService');

const email24HoursBeforeScheduleToClient = require('../messages/emails/client/email24HoursBeforeScheduleToClient');
const email24HoursBeforeScheduleToBarber = require('../messages/emails/barber/email24HoursBeforeScheduleToBarber');
const emailOneHourBeforeScheduleToClient = require('../messages/emails/client/emailOneHourBeforeScheduleToClient');
const emailOneHourBeforeScheduleToBarber = require('../messages/emails/barber/emailOneHourBeforeScheduleToBarber');

async function sendNotification() {
  const currentDate = getCurrentDate();

  const currentDateAndtime = new Date();
  currentDateAndtime.setUTCSeconds(0, 0);

  const schedules = await ScheduleRepository.findByConfirmed(currentDate);

  for (const schedule of schedules) {
    const scheduleDateMinus24Hours = new Date(`${schedule.schedule_date}T${schedule.hour}Z`);
    scheduleDateMinus24Hours.setUTCHours(scheduleDateMinus24Hours.getUTCHours() - 24);

    const scheduleDateMinusOneHour = new Date(`${schedule.schedule_date}T${schedule.hour}Z`);
    scheduleDateMinusOneHour.setUTCHours(scheduleDateMinusOneHour.getUTCHours() - 1);

    const {
      dateInPortugal,
      hourInPortugal,
    } = getDateAndHourPortugalTimeZone(schedule.schedule_date, schedule.hour);

    // envia mensagem se for 24h antes do agendamento
    if (currentDateAndtime.getTime() === scheduleDateMinus24Hours.getTime()) {
      const clientResult = await sendEmail({
        subject: 'Seu agendamento é amanhã',
        message: email24HoursBeforeScheduleToClient({
          dateInPortugal,
          hourInPortugal,
          service_type: schedule.service_type,
        }),
      });
      console.log(clientResult);

      const barberResult = await sendEmail({
        subject: 'Agendamento amanhã',
        message: email24HoursBeforeScheduleToBarber({
          dateInPortugal,
          hourInPortugal,
          service_type: schedule.service_type,
          client_name: schedule.client_name,
          client_phone: schedule.client_phone,
          client_email: schedule.client_email,
        }),
      });
      console.log(barberResult);
    } else if (currentDateAndtime.getTime() === scheduleDateMinusOneHour.getTime()) {
      // envia mensagem se for 1h antes do agendamento

      const clientResult = await sendEmail({
        subject: 'Seu agendamento é em uma hora',
        message: emailOneHourBeforeScheduleToClient({
          dateInPortugal,
          hourInPortugal,
          service_type: schedule.service_type,
        }),
      });
      console.log(clientResult);

      const barberResult = await sendEmail({
        subject: 'Agendamento em uma hora',
        message: emailOneHourBeforeScheduleToBarber({
          dateInPortugal,
          hourInPortugal,
          service_type: schedule.service_type,
          client_name: schedule.client_name,
          client_phone: schedule.client_phone,
          client_email: schedule.client_email,
        }),
      });
      console.log(barberResult);
    }
  }
}

cron.schedule('*/30 5-22 * * *', () => {
  sendNotification();
}, {
  timezone: 'Etc/UTC',
});
