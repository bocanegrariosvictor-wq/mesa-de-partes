const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Document, Workflow } = require('../models');

// Derivar documento a un área/rol
router.post('/derive', auth, async (req, res) => {
  const { documentId, toRole, note } = req.body;
  const doc = await Document.findByPk(documentId);
  if (!doc) return res.status(404).json({ message: 'Documento no existe' });
  const movement = await Workflow.create({ documentId, fromRole: req.user.role, toRole, note, createdBy: req.user.id, action: 'Derivación' });
  await doc.update({ estado: 'En Proceso' });
  res.json({ movement });
});

// Cambiar estado (Atendido/Archivado)
router.post('/update-state', auth, async (req, res) => {
  const { documentId, estado, note } = req.body;
  const doc = await Document.findByPk(documentId);
  if (!doc) return res.status(404).json({ message: 'Documento no existe' });
  await doc.update({ estado });
  await Workflow.create({ documentId, fromRole: req.user.role, toRole: doc.destinatario || 'interno', note, createdBy: req.user.id, action: 'Cambio de Estado' });
  res.json({ ok: true });
});

module.exports = router;
