function getDateAndHourPortugalTimeZone(date, hour) {
  const scheduleDateAndTime = new Date(`${date}T${hour}Z`);

  const scheduleDatePortugalFormat = scheduleDateAndTime.toLocaleString('pt-PT', {
    timeZone: 'Europe/Lisbon',
  });

  const dateAndHour = scheduleDatePortugalFormat.split(', ');
  const dateInPortugal = dateAndHour[0];

  const hourWithSeconds = dateAndHour[1];
  const hourInPortugal = hourWithSeconds.substring(0, 5);

  return {
    dateInPortugal: dateInPortugal || date,
    hourInPortugal: hourInPortugal || hour,
  };
}

module.exports = getDateAndHourPortugalTimeZone;
