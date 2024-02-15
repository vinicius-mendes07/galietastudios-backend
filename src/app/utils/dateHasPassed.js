function dateHasPassed(schedule_date) {
  const scheduleDateInDateFormat = new Date(schedule_date);

  scheduleDateInDateFormat.setUTCHours(0, 0, 0, 0);

  scheduleDateInDateFormat.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' });

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);
  currentDate.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' });

  if (scheduleDateInDateFormat < currentDate) {
    return true;
  }

  return false;
}

module.exports = dateHasPassed;
