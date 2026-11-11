CREATE TABLE IF NOT EXISTS renewal_rate (
  identity TEXT PRIMARY KEY,
  minute INTEGER NOT NULL,
  hits INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS renewal_rate_minute ON renewal_rate(minute);
