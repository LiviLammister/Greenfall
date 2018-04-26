const Sequelize = require('sequelize');

const db = require('../db');

const Inflow = db.define('inflow', {
    name : {
        type         : Sequelize.STRING,
        unique       : true,
        defaultValue : 'misc',
    },
    amt : {
        type         : Sequelize.FLOAT,
        allowNull    : false,
        defaultValue : 0.00,
    },
});

module.exports = Inflow;