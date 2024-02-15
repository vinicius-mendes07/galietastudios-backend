const db = require('../../database');

class ScheduleRepository {
  async findAll() {
    const rows = await db.query(`
    SELECT id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    FROM schedules
    `);

    return rows;
  }

  async findByDateAndHour({ schedule_date, hour }) {
    const [row] = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1 AND hour = $2
    `, [schedule_date, hour]);

    return row;
  }

  async findByDateNotAvailable({ schedule_date }) {
    const rows = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1 AND available = false
    `, [schedule_date]);

    return rows;
  }

  async create({
    name,
    phone,
    email,
    schedule_date,
    hour,
    hour_end,
    service_id,
    user_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO schedules(name, phone, email, schedule_date, hour, hour_end, service_id, user_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, phone, email, schedule_date, hour, hour_end, service_id, user_id]);

    return row;
  }
}

module.exports = new ScheduleRepository();
