const cron = require('node-cron');
const ScheduleRepository = require('../repositories/ScheduleRepository');
const getCurrentDate = require('../utils/getCurrentDate');
const getDateAndHourPortugalTimeZone = require('../utils/getDateAndHourPortugalTimeZone');
const sendEmail = require('./emailService');

async function sendNotification() {
  const currentDate = getCurrentDate();

  const currentDateAndtime = new Date();
  currentDateAndtime.setUTCSeconds(0, 0);

  const schedules = await ScheduleRepository.findByConfirmed(currentDate);

  for (const schedule of schedules) {
    const scheduleDateMinus24Hours = new Date(`${schedule.schedule_date}T${schedule.hour}Z`);
    scheduleDateMinus24Hours.setUTCHours(scheduleDateMinus24Hours.getUTCHours() - 24);
    console.log('scheduleDate Minus 24Hours', scheduleDateMinus24Hours);

    const scheduleDateMinusOneHour = new Date(`${schedule.schedule_date}T${schedule.hour}Z`);
    scheduleDateMinusOneHour.setUTCHours(scheduleDateMinusOneHour.getUTCHours() - 1);
    console.log('scheduleDate Minus 1 Hour', scheduleDateMinusOneHour);

    console.log('currentDate and time', currentDateAndtime);

    const {
      dateInPortugal,
      hourInPortugal,
    } = getDateAndHourPortugalTimeZone(schedule.schedule_date, schedule.hour);

    // envia mensagem se for 24h antes do agendamento
    if (currentDateAndtime.getTime() === scheduleDateMinus24Hours.getTime()) {
      console.log('24h antes: enviar email');

      const clientResult = await sendEmail({
        subject: 'Seu agendamento é amanhã',
        message: `
          Seu agendamento na Galieta Barber Shop é amanha!
          Data: ${dateInPortugal}
          Hora: ${hourInPortugal}
          Serviço: ${schedule.service_type}
        `,
      });
      console.log(clientResult);

      const barberResult = await sendEmail({
        subject: 'Agendamento amanhã',
        message: `
          Você tem um agendamento marcado amanhã.
          nome: ${schedule.client_name}
          telefone: ${schedule.client_phone}
          email: ${schedule.client_email}
          Data: ${dateInPortugal}
          Hora: ${hourInPortugal}
          Serviço: ${schedule.service_type}`,
      });
      console.log(barberResult);
    } else if (currentDateAndtime.getTime() === scheduleDateMinusOneHour.getTime()) {
      // envia mensagem se for 1h antes do agendamento
      console.log('1h antes: enviar email');
      const clientResult = await sendEmail({
        subject: 'Seu agendamento é em uma hora',
        message: `
          Seu agendamento na Galieta Barber Shop é em uma hora, não se esqueça!
          Data: ${dateInPortugal}
          Hora: ${hourInPortugal}
          Serviço: ${schedule.service_type}
        `,
      });
      console.log(clientResult);

      const barberResult = await sendEmail({
        subject: 'Agendamento em uma hora',
        message: `
          Você tem um agendamento marcado em uma hora.
          nome: ${schedule.client_name}
          telefone: ${schedule.client_phone}
          email: ${schedule.client_email}
          Data: ${dateInPortugal}
          Hora: ${hourInPortugal}
          Serviço: ${schedule.service_type}`,
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
