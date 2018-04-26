const Inflow   = require('./inflow');
const Outflow  = require('./outflow');
const Resevoir = require('./outflow');
const User     = require('./user');

/**
 * Inflow Associations
 */
Inflow.belongsTo(Resevoir);
Resevoir.hasMany(Inflow);

/**
 * Outflow Associations
 */
Outflow.belongsTo(Resevoir);
Resevoir.hasMany(Inflow);

module.exports = {
  Inflow,
  Outflow,
  Resevoir,
  User,
}
