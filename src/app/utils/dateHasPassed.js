function dateHasPassed(schedule_date) {
  const scheduleDate = new Date(schedule_date);

  scheduleDate.setUTCHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  if (scheduleDate.getTime() < currentDate.getTime()) {
    return true;
  }

  return false;
}

module.exports = dateHasPassed;
