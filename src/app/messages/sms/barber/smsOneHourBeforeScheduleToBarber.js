const formatPhone = require('../../../utils/formatPhone');

function smsOneHourBeforeScheduleToBarber({
  dateInPortugal,
  hourInPortugal,
  service_type,
  client_name,
  client_phone,
}) {
  return `
Voce tem um agendamento em uma hora.

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}
Nome: ${client_name}
Telefone: ${formatPhone(client_phone)}
`;
}

module.exports = smsOneHourBeforeScheduleToBarber;
