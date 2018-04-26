const router = require('express').Router();

const { Resevoir } = require('../db/models');

module.exports = Resevoir;

router.get('/', async (req, res, next) => {
    try {
        const resevoirs = await Resevoir.findAll();
        res.json(resevoirs);
    } catch (err) {
        next(err);
    }
});

router.get('/:date', async (req, res, next) => {
    try {
        const resevoir = await Resevoir.findOne({
            where : { date : req.params.date }
        });
        res.json(resevoir);
    } catch (err) {
        next(err);
    }
});
