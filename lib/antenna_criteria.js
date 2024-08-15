const { AntennaCriterion } = require('../models');

exports.listCriteria = async (req, res) => {
    console.log(req, res)
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
    console.log(req, res)
    // TODO permissions

    const result = await AntennaCriterion.upsert(req.body);

    return res.json({
        success: true,
        data: result
    });
};
