const { AntennaCriterion } = require('../models');

exports.listCriteria = async (req, res) => {
    if (!req.permissions.hasPermission('global:manage_network:antenna_criteria')) {
        return errors.makeForbiddenError(res, 'You are not allowed to list Antenna Criteria.');
    }

    const criteria = await AntennaCriterion.findAll({
        where: { agora_id: Number(req.params.agora_id) }
    });

    return res.json({
        success: true,
        data: criteria
    });
};

exports.setCriterion = async (req, res) => {
    const criterion = req.body['antenna_criterion'].replace(/ /g, "_");
    const needed_permission = 'global:manage_network:' + criterion;

    if (!req.permissions.hasPermission(needed_permission)) {
        return errors.makeForbiddenError(res, 'You are not allowed to set fulfilment of this Antenna Criterion.');
    }

    if (req.body['antenna_criterion'] === 'communication' && req.body['value'] === 'exception' && !req.permissions.hasPermission('global:manage_network:communication_exception')) {
        return errors.makeForbiddenError(res, 'You are not allowed to give exceptions to the Antenna Criterion `communication`.');
    }

    // The `.upsert()` method returns an object [result, created],
    // where `created` is a boolen whether the result was created or updated
    const result = await AntennaCriterion.upsert(req.body);

    return res.json({
        success: true,
        data: result[0]
    });
};
