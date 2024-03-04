function smsOneHourBeforeScheduleToClient({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return `
Seu agendamento é em uma hora, nao se esqueca!

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}
`;
}

module.exports = smsOneHourBeforeScheduleToClient;
