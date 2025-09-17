const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const generateNumber = require('../utils/numberGenerator');
const { Document, Workflow } = require('../models');
const { Op } = require('sequelize');

// Registrar documento
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { remitente, destinatario, asunto, tipo } = req.body;
    const file = req.file;
    const tramiteNumber = generateNumber();
    const doc = await Document.create({
      tramiteNumber,
      remitente,
      destinatario,
      asunto,
      tipo,
      archivoPath: file ? file.filename : null,
      createdBy: req.user.id
    });

    await Workflow.create({ documentId: doc.id, fromRole: 'externo', toRole: 'mesa', action: 'Registro', createdBy: req.user.id });

    res.json({ doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar' });
  }
});

// Búsqueda simple
router.get('/', auth, async (req, res) => {
  const { q, tramite } = req.query;
  const where = {};
  if (tramite) where.tramiteNumber = tramite;
  if (q) where.remitente = { [Op.iLike]: `%${q}%` };
  const docs = await Document.findAll({ where, include: [{ model: Workflow, as: 'movements' }] });
  res.json(docs);
});

// Consulta externa por número de trámite (sin auth)
router.get('/public/:tramite', async (req, res) => {
  const { tramite } = req.params;
  const doc = await Document.findOne({ where: { tramiteNumber: tramite }, include: [{ model: Workflow, as: 'movements' }] });
  if (!doc) return res.status(404).json({ message: 'No encontrado' });
  res.json({ tramite: doc.tramiteNumber, estado: doc.estado, movimientos: doc.movements });
});

module.exports = router;
