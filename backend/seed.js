const { db, uuidv4 } = require('./database');

const services = ['Auth Service', 'Payment Gateway', 'User Management', 'Notification Service', 'Analytics Service', 'Search Service', 'Content Delivery', 'Database Service'];
const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
const owners = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emily Davis', 'Chris Wilson', 'Lisa Anderson'];

const generateRandomIncident = () => {
  const service = services[Math.floor(Math.random() * services.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const owner = Math.random() > 0.3 ? owners[Math.floor(Math.random() * owners.length)] : null;
  
  return {
    id: uuidv4(),
    title: `Incident in ${service} - ${severity}`,
    service,
    severity,
    status,
    owner,
    summary: Math.random() > 0.5 ? `This is a summary of the incident in ${service}. It requires immediate attention.` : null,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
  };
};

const seedDatabase = () => {
  console.log('Seeding database with 200 incidents...');
  
  const incidents = [];
  for (let i = 0; i < 200; i++) {
    incidents.push(generateRandomIncident());
  }
  
  const insertStmt = db.prepare(`
    INSERT INTO incidents (id, title, service, severity, status, owner, summary, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  incidents.forEach(incident => {
    insertStmt.run([
      incident.id,
      incident.title,
      incident.service,
      incident.severity,
      incident.status,
      incident.owner,
      incident.summary,
      incident.createdAt,
      incident.updatedAt
    ]);
  });
  
  insertStmt.finalize();
  
  console.log('Database seeded successfully with 200 incidents!');
  
  db.close();
};

// Check if table exists and then seed
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='incidents'", (err, row) => {
  if (err) {
    console.error('Error checking table:', err.message);
  } else if (row) {
    // Clear existing data before seeding
    db.run('DELETE FROM incidents', (err) => {
      if (err) {
        console.error('Error clearing table:', err.message);
      } else {
        seedDatabase();
      }
    });
  }
});