const { AntennaCriterion } = require('../models');

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
    // TODO permissions

    // The `.upsert()` method returns an object [result, created],
    // where `created` is a boolen whether the result was created or updated
    const result = await AntennaCriterion.upsert(req.body);

    return res.json({
        success: true,
        data: result[0]
    });
};
