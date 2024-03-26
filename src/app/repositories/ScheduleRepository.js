const db = require('../../database');

class ScheduleRepository {
  async findAll(currentDate, date = '') {
    let rows = [];
    if (date === '') {
      rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE schedule_date >= $1 AND available = true
      ORDER BY schedule_date, hour
      `, [currentDate]);
    } else {
      rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE schedule_date >= $1 AND available = true AND schedule_date = $2
      ORDER BY schedule_date, hour
      `, [currentDate, date]);
    }

    return rows;
  }

  async findSchedulesAndCanceledDays(currentDate) {
    let rows = [];

    rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE schedule_date >= $1
      ORDER BY schedule_date, hour
      `, [currentDate]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
    services.service_type, services.duration,
    users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
    FROM schedules
    LEFT JOIN services ON services.id = schedules.service_id
    LEFT JOIN users ON users.id = schedules.user_id
    WHERE schedules.id = $1
    `, [id]);

    return row;
  }

  async findCanceledDays(currentDate) {
    const rows = await db.query(`
    SELECT schedules.id, schedules.available, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
    users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
    FROM schedules
    LEFT JOIN users ON users.id = schedules.user_id
    WHERE schedule_date >= $1 AND available = false
    ORDER BY schedule_date, hour
    `, [currentDate]);

    return rows;
  }

  async findByPending(currentDate) {
    const rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE status = 'pendente' AND schedule_date >= $1  AND available = true
      ORDER BY schedule_date, hour
    `, [currentDate]);

    return rows;
  }

  async findByConfirmed(currentDate) {
    const rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE status = 'confirmado' AND schedule_date >= $1  AND available = true
      ORDER BY schedule_date, hour
    `, [currentDate]);

    return rows;
  }

  async findByDateNotAvailable(schedule_date) {
    const [row] = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1 AND available = false
    `, [schedule_date]);

    return row;
  }

  async findByDateAndHour({ schedule_date, hour, user_id }) {
    const [row] = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1 AND hour = $2 AND user_id = $3
    `, [schedule_date, hour, user_id]);

    return row;
  }

  async findByServiceId({ id, currentDate }) {
    const rows = await db.query(`
      SELECT schedules.id, schedules.name AS client_name, schedules.phone AS client_phone, schedules.email AS client_email, schedules.hour, schedules.hour_end, schedules.available, schedules.status, schedules.service_id, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date,
      services.service_type, services.duration,
      users.name AS barber_name, users.phone AS barber_phone, users.email AS barber_email
      FROM schedules
      LEFT JOIN services ON services.id = schedules.service_id
      LEFT JOIN users ON users.id = schedules.user_id
      WHERE schedule_date >= $1 AND available = true AND services.id = $2
      ORDER BY schedule_date, hour
      `, [currentDate, id]);

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
      RETURNING id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    `, [name, phone, email, schedule_date, hour, hour_end, service_id, user_id]);

    return row;
  }

  async confirmSchedule(id, { status }) {
    const [row] = await db.query(`
    UPDATE schedules
    SET status = $1
    WHERE id = $2
    RETURNING id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    `, [status, id]);

    return row;
  }

  async findByDay(schedule_date) {
    const [row] = await db.query(`
      SELECT * FROM schedules
      WHERE schedule_date = $1
    `, [schedule_date]);

    return row;
  }

  async cancelDay({
    name,
    phone,
    email,
    schedule_date,
    hour,
    hour_end,
    available,
    service_id,
    user_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO schedules(name, phone, email, schedule_date, hour, hour_end, available, service_id, user_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING schedules.id, schedules.available, schedules.user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    `, [name, phone, email, schedule_date, hour, hour_end, available, service_id, user_id]);

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
      RETURNING id, name, phone, email, hour, hour_end, available, status, service_id, user_id, TO_CHAR(schedule_date, 'YYYY-MM-DD') AS schedule_date
    `, [name, phone, email, schedule_date, hour, hour_end, service_id, user_id, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM schedules WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ScheduleRepository();
