function convertHoursToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function convertMinutesToHour(minutes) {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutesRemaining).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

function sumTime(time, minutes) {
  const hourInMinutes = convertHoursToMinutes(time);
  const resultInMinutes = hourInMinutes + minutes;

  return convertMinutesToHour(resultInMinutes);
}

module.exports = sumTime;
