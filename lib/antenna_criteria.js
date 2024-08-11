const moment = require('moment');

const { AntennaCriterion } = require('../models');
const errors = require('./errors');
const helpers = require('./helpers');
const { sequelize } = require('./sequelize');

exports.listCriteria = async (req, res) => {
    // TODO permissions

    const criteria = await AntennaCriterion.findAll({
        where: { agora_id: Number(req.params.agora_id) }
    });

    return res.json({
        success: true,
        data: criteria
    });
};

exports.setCriterion = async (req, res) => {
    // if (!req.permissions.set_antenna_criteria.global) {
    //     return errors.makeForbiddenError(res, 'You are not allowed to set Antenna Criteria fulfilment.');
    // }

    const criterion = await AntennaCriterion.create(
        req.body
    )

    return res.json({
        success: true,
        data: criterion
    });
};
