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
    // if (!req.permissions.set_antenna_criteria.global) {
    //     return errors.makeForbiddenError(res, 'You are not allowed to set Antenna Criteria fulfilment.');
    // }

    const result = await AntennaCriterion.upsert(req.body);

    return res.json({
        success: true,
        data: result
    });
};

// exports.findCriterion = async (req, res, next) => {
//     // TODO permissions

//     if (!helpers.isNumber(req.params.agora_id)) {
//         return errors.makeBadRequestError(res, 'Agora ID is invalid.');
//     }
//     if (!helpers.isNumber(req.body.body_id)) {
//         return errors.makeBadRequestError(res, 'Body ID is invalid.');
//     }
//     const criterion = await AntennaCriterion.findOne({
//         where: {
//             agora_id: Number(req.params.agora_id),
//             body_id: Number(req.body.body_id),
//             antenna_criterion: req.body.antenna_criterion
//         }
//     });

//     req.criterion = criterion;
//     return next();
// }

// exports.updateCriterion = async (req, res) => {
//     // TODO permissions

//     await req.criterion.update(req.body);

//     return res.json({
//         success: true,
//         data: req.criterion
//     });
// };
