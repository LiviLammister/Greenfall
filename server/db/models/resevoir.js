import { SERVFAIL } from 'dns';

const Sequelize = require('sequelize');

const db = require('../db');

module.exports = Resevoir;

const Resevoir = db.define('resevoir', {
    month : {
        type      : Sequelize.INTEGER,
        allowNull : false,
        validate  : {
            min : 0,
            max : 12,
        },
    },
    year : {
        type      : Sequelize.INTEGER,
        allowNull : false,
    },
    date : {
        type : Sequelize.VIRTUAL,
        get () {
            return (String(this.getDataValue('year')) + '-' + String(this.getDataValue('month')));
        }
    }
});
