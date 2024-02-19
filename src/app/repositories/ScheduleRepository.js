const db = require('../../database');

class ScheduleRepository {
  async findAll(currentDate) {
    const rows = await db.query(`
    SELECT id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    FROM schedules
    WHERE schedule_date >= $1
    ORDER BY schedule_date
    `, [currentDate]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    FROM schedules
    WHERE id = $1
    `, [id]);

    return row;
  }

  async findByPending(currentDate) {
    const rows = await db.query(`
      SELECT id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
      FROM schedules
      WHERE status = 'pendente' AND schedule_date >= $1
      ORDER BY schedule_date
    `, [currentDate]);

    return rows;
  }

  async findByConfirmed(currentDate) {
    const rows = await db.query(`
      SELECT id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
      FROM schedules
      WHERE status = 'confirmado' AND schedule_date >= $1
      ORDER BY schedule_date
    `, [currentDate]);

    return rows;
  }

  async findByDateAndHour({ schedule_date, hour, user_id }) {
    const [row] = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1 AND hour = $2 AND user_id = $3
    `, [schedule_date, hour, user_id]);

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

  async confirmSchedule(id, { status }) {
    const [row] = await db.query(`
    UPDATE schedules
    SET status = $1
    WHERE id = $2
    RETURNING *
    `, [status, id]);

    return row;
  }

  async update(id, {
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
      UPDATE schedules
      SET name = $1, phone = $2, email = $3, schedule_date = $4, hour = $5, hour_end = $6, service_id = $7, user_id = $8
      WHERE id = $9
      RETURNING *
    `, [name, phone, email, schedule_date, hour, hour_end, service_id, user_id, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM schedules WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ScheduleRepository();
