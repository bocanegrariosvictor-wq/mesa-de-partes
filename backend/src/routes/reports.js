const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { Document, Workflow } = require('../models');
const { Sequelize } = require('sequelize');

// Documents count by estado
router.get('/counts-by-status', auth, roleCheck(['admin','mesa','area']), async (req, res) => {
  const rows = await Document.findAll({
    attributes: ['estado', [Sequelize.fn('COUNT', Sequelize.col('estado')), 'count']],
    group: ['estado']
  });
  res.json(rows);
});

// Average time to attend (simple approximation based on workflow timestamps)
router.get('/avg-time-attention', auth, roleCheck(['admin','mesa','area']), async (req, res) => {
  // This demo approximates by measuring time between first movement and 'Cambio de Estado' to Atendido
  const sql = `
    SELECT d.id, d.tramiteNumber,
      MIN(w."createdAt") FILTER (WHERE w.action='Registro') as registro_at,
      MIN(w."createdAt") FILTER (WHERE w.action='Cambio de Estado' AND d.estado='Atendido') as atendido_at
    FROM Documents d
    JOIN Workflows w ON w."documentId" = d.id
    GROUP BY d.id, d.tramiteNumber
  `;
  // Using Sequelize.query with raw SQL may vary by dialect; for SQLite this query structure is acceptable.
  const results = await Document.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
  // compute durations in ms where possible
  const durations = results.map(r => {
    if (r.registro_at && r.atendido_at) {
      return new Date(r.atendido_at) - new Date(r.registro_at);
    }
    return null;
  }).filter(d=>d!==null);
  const avg = durations.length ? Math.round(durations.reduce((a,b)=>a+b,0)/durations.length) : null;
  res.json({ averageMs: avg, sampleCount: durations.length });
});

module.exports = router;
