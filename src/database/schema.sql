CREATE DATABASE galietastudios;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS services (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	service_type VARCHAR NOT NULL UNIQUE,
	duration INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS schedules (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	name VARCHAR NOT NULL,
	phone VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	schedule_date DATE NOT NULL,
	hour TIME NOT NULL,
	hour_end TIME NOT NULL,
	available BOOLEAN DEFAULT TRUE,
	status VARCHAR DEFAULT 'pendente',
	service_id UUID NOT NULL,
	user_id UUID NOT NULL,
  FOREIGN KEY(service_id) REFERENCES services(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS users (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	name VARCHAR NOT NULL,
	phone VARCHAR NOT NULL,
	email VARCHAR NOT NULL UNIQUE,
	password VARCHAR NOT NULL,
	role VARCHAR NOT NULL
);
