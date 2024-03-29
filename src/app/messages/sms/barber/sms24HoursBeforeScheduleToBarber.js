const formatPhone = require('../../../utils/formatPhone');

function sms24HoursBeforeScheduleToBarber({
  dateInPortugal,
  hourInPortugal,
  service_type,
  client_name,
  client_phone,
}) {
  return `
Voce tem um agendamento amanha.

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}
Nome: ${client_name}
Telefone: ${formatPhone(client_phone)}
`;
}

module.exports = sms24HoursBeforeScheduleToBarber;
