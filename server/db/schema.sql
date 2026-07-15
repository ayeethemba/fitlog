-- FitLog database schema
-- Run against a fresh PostgreSQL database:  psql $DATABASE_URL -f schema.sql

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(254)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS workouts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date       DATE        NOT NULL,
    notes      VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id          SERIAL PRIMARY KEY,
    workout_id  INTEGER       NOT NULL REFERENCES workouts(id)  ON DELETE CASCADE,
    exercise_id INTEGER       NOT NULL REFERENCES exercises(id),
    sets        INTEGER       NOT NULL CHECK (sets > 0),
    reps        INTEGER       NOT NULL CHECK (reps > 0),
    weight      NUMERIC(6, 2) NOT NULL CHECK (weight >= 0)
);

-- Indexes for the app's hot lookups
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON workout_exercises (workout_id);

-- Seed exercises
INSERT INTO exercises (name) VALUES
    ('Bench Press'),
    ('Squat'),
    ('Deadlift'),
    ('Overhead Press'),
    ('Barbell Row'),
    ('Pull Up'),
    ('Bicep Curl'),
    ('Tricep Extension'),
    ('Leg Press'),
    ('Lat Pulldown'),
    ('Incline Dumbbell Press'),
    ('Romanian Deadlift'),
    ('Lunges'),
    ('Plank'),
    ('Running')
ON CONFLICT (name) DO NOTHING;
