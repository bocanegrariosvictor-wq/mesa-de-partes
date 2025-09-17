const sequelize = require('../config/db');
const User = require('./user')(sequelize);
const Document = require('./document')(sequelize);
const Workflow = require('./workflow')(sequelize);

User.hasMany(Document, { as: 'createdDocuments', foreignKey: 'createdBy' });
Document.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

Document.hasMany(Workflow, { as: 'movements', foreignKey: 'documentId' });
Workflow.belongsTo(Document, { foreignKey: 'documentId' });

module.exports = { sequelize, User, Document, Workflow };
