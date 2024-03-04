function canceledScheduleSms({ dateInPortugal, hourInPortugal }) {
  // Infelizmente, seu agendamento para a data ${dateInPortugal} as ${hourInPortugal} foi cancelado.
  return `
Agendamento para a data ${dateInPortugal} as ${hourInPortugal} foi cancelado.

Para reagendar, acesse: https://galieta-barbershop.com/agendar
`;
}

module.exports = canceledScheduleSms;
