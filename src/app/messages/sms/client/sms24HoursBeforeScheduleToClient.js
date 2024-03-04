function sms24HoursBeforeScheduleToClient({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return `
Seu agendamento é amanha, nao se esqueca!

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}
`;
}

module.exports = sms24HoursBeforeScheduleToClient;
