const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const { db, uuidv4 } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const sortableColumns = new Set(['title', 'service', 'severity', 'status', 'owner', 'createdAt', 'updatedAt']);
const sortOrders = new Set(['asc', 'desc']);

const incidentSchema = Joi.object({
  title: Joi.string().required().max(255),
  service: Joi.string().required(),
  severity: Joi.string().valid('SEV1', 'SEV2', 'SEV3', 'SEV4').required(),
  status: Joi.string().valid('OPEN', 'MITIGATED', 'RESOLVED').default('OPEN'),
  owner: Joi.string().allow(null, ''),
  summary: Joi.string().allow(null, '')
});

const updateIncidentSchema = Joi.object({
  id: Joi.forbidden(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
  title: Joi.string().max(255),
  service: Joi.string(),
  severity: Joi.string().valid('SEV1', 'SEV2', 'SEV3', 'SEV4'),
  status: Joi.string().valid('OPEN', 'MITIGATED', 'RESOLVED'),
  owner: Joi.string().allow(null, ''),
  summary: Joi.string().allow(null, '')
}).min(1);

app.get('/', (req, res) => {
  res.json({
    service: 'Incident Tracker API',
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/incidents', '/api/services', '/health']
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/incidents', (req, res) => {
  const { error, value } = incidentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const incident = {
    id: uuidv4(),
    ...value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const query = `
    INSERT INTO incidents (id, title, service, severity, status, owner, summary, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    incident.id,
    incident.title,
    incident.service,
    incident.severity,
    incident.status,
    incident.owner,
    incident.summary,
    incident.createdAt,
    incident.updatedAt
  ], function(err) {
    if (err) {
      console.error('Error creating incident:', err);
      return res.status(500).json({ error: 'Failed to create incident' });
    }
    
    res.status(201).json(incident);
  });
});

app.get('/api/incidents', (req, res) => {
  const parsedLimit = parseInt(req.query.limit, 10);
  const parsedPage = parseInt(req.query.page, 10);
  const limit = Math.min(Math.max(Number.isNaN(parsedLimit) ? 10 : parsedLimit, 1), 100);
  const page = Math.max(Number.isNaN(parsedPage) ? 1 : parsedPage, 1);
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const service = req.query.service || '';
  const severity = req.query.severity || '';
  const status = req.query.status || '';
  const owner = req.query.owner || '';
  const requestedSortBy = req.query.sortBy || 'createdAt';
  const requestedSortOrder = (req.query.sortOrder || 'desc').toLowerCase();
  const sortBy = sortableColumns.has(requestedSortBy) ? requestedSortBy : 'createdAt';
  const sortOrder = sortOrders.has(requestedSortOrder) ? requestedSortOrder : 'desc';
  
  let whereClause = 'WHERE 1=1';
  const params = [];
  
  if (search) {
    whereClause += ' AND (title LIKE ? OR summary LIKE ? OR service LIKE ? OR owner LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (service) {
    whereClause += ' AND service = ?';
    params.push(service);
  }
  
  if (severity) {
    whereClause += ' AND severity = ?';
    params.push(severity);
  }
  
  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }

  if (owner) {
    whereClause += ' AND owner LIKE ?';
    params.push(`%${owner}%`);
  }
  
  const orderBy = `${sortBy} ${sortOrder}, id ${sortOrder}`;
  
  const countQuery = `SELECT COUNT(*) as total FROM incidents ${whereClause}`;
  const selectQuery = `SELECT * FROM incidents ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  
  db.get(countQuery, params, (err, row) => {
    if (err) {
      console.error('Error counting incidents:', err);
      return res.status(500).json({ error: 'Failed to count incidents' });
    }
    
    const total = row.total;
    const totalPages = Math.ceil(total / limit);
    
    db.all(selectQuery, [...params, limit, offset], (err, incidents) => {
      if (err) {
        console.error('Error fetching incidents:', err);
        return res.status(500).json({ error: 'Failed to fetch incidents' });
      }
      
      res.json({
        incidents,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });
    });
  });
});

app.get('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM incidents WHERE id = ?';
  
  db.get(query, [id], (err, incident) => {
    if (err) {
      console.error('Error fetching incident:', err);
      return res.status(500).json({ error: 'Failed to fetch incident' });
    }
    
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json(incident);
  });
});

app.patch('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const { error, value } = updateIncidentSchema.validate(req.body, { allowUnknown: false });
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const updates = Object.keys(value);
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }
  
  const setClause = updates.map(key => `${key} = ?`).join(', ');
  const params = [...updates.map(key => value[key]), new Date().toISOString(), id];
  
  const query = `UPDATE incidents SET ${setClause}, updatedAt = ? WHERE id = ?`;
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Error updating incident:', err);
      return res.status(500).json({ error: 'Failed to update incident' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    db.get('SELECT * FROM incidents WHERE id = ?', [id], (err, updatedIncident) => {
      if (err) {
        console.error('Error fetching updated incident:', err);
        return res.status(500).json({ error: 'Failed to fetch updated incident' });
      }
      
      res.json(updatedIncident);
    });
  });
});

app.get('/api/services', (req, res) => {
  const query = 'SELECT DISTINCT service FROM incidents ORDER BY service';
  
  db.all(query, [], (err, services) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
    
    res.json(services.map(s => s.service));
  });
});

app.get('/api/owners', (req, res) => {
  const query = "SELECT DISTINCT owner FROM incidents WHERE owner IS NOT NULL AND owner != '' ORDER BY owner";
  
  db.all(query, [], (err, owners) => {
    if (err) {
      console.error('Error fetching owners:', err);
      return res.status(500).json({ error: 'Failed to fetch owners' });
    }
    
    res.json(owners.map(o => o.owner));
  });
});

app.delete('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM incidents WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Error deleting incident:', err);
      return res.status(500).json({ error: 'Failed to delete incident' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    res.json({ message: 'Incident deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
