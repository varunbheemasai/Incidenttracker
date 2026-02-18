const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'incidents.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    createTable();
  }
});

function createTable() {
  const createIncidentsTable = `
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      service TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('SEV1', 'SEV2', 'SEV3', 'SEV4')),
      status TEXT NOT NULL CHECK(status IN ('OPEN', 'MITIGATED', 'RESOLVED')),
      owner TEXT,
      summary TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createIncidentsTable, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Incidents table created or already exists');
      createIndexes();
    }
  });
}

function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents(service)',
    'CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity)',
    'CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status)',
    'CREATE INDEX IF NOT EXISTS idx_incidents_createdAt ON incidents(createdAt)'
  ];

  indexes.forEach((query) => {
    db.run(query, (err) => {
      if (err) {
        console.error('Error creating index:', err.message);
      }
    });
  });
}

module.exports = {
  db,
  uuidv4
};
