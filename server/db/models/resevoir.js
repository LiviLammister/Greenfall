const Sequelize = require('sequelize');

const db = require('../db');

const Resevoir = db.define('resevoir', {
    date: {
        type         : Sequelize.DATEONLY,
        defaultValue : Sequelize.NOW,  
    }
});

module.exports = Resevoir;