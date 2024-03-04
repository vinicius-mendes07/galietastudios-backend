function sms24HoursBeforeScheduleToBarber({
  dateInPortugal,
  hourInPortugal,
  service_type,
  client_name,
  client_phone,
}) {
  return `
Voca tem um agendamento amanha.

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}
Nome: ${client_name}
Telefone: ${client_phone}
  `;
}

module.exports = sms24HoursBeforeScheduleToBarber;
