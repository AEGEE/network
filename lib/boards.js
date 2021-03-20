const moment = require('moment');
const { Op } = require('sequelize');

const { Board } = require('../models');
const errors = require('./errors');
const helpers = require('./helpers');

exports.createBoard = async (req, res) => {
    if (!req.permissions.manage_boards) {
        return errors.makeForbiddenError(res, 'You are not allowed to create boards.');
    }

    const board = await Board.create(req.body);

    return res.json({
        success: true,
        data: board
    });
};

exports.listAllBoards = async (req, res) => {
    const boards = await Board.findAll({
      order: helpers.getSorting(req.query)
    });

    return res.json({
        success: true,
        data: boards
    });
};

exports.listAllBoardsBody = async (req, res) => {
    if (!helpers.isNumber(req.params.body_id)) {
        return errors.makeBadRequestError(res, 'Body ID is invalid.');
    }
    const boards = await Board.findAll({
        where: { body_id: Number(req.params.body_id) },
        order: helpers.getSorting(req.query)
    });

    if (!boards) {
        return errors.makeNotFoundError(res, 'There are no boards for this body.');
    }

    return res.json({
        success: true,
        data: boards
    });
};

exports.listCurrentBoardBody = async (req, res) => {
    if (!helpers.isNumber(req.params.body_id)) {
        return errors.makeBadRequestError(res, 'Body ID is invalid.');
    }

    const today = moment().format('YYYY-MM-DD');

    const board = await Board.findAll({
        where: {
            body_id: Number(req.params.body_id),
            start_date: { [Op.lte]: today },
            end_date: { [Op.gte]: today }
        },
        order: [['start_date', 'DESC']]
    });

    if (!board) {
        return errors.makeNotFoundError(res, 'There is no current board.');
    }

    return res.json({
        success: true,
        data: board
    });
};

exports.findBoard = async (req, res) => {
    if (!helpers.isNumber(req.params.board_id)) {
        return errors.makeBadRequestError(res, 'Board ID is invalid.');
    }
    const board = await Board.findOne({
        where: { id: Number(req.params.board_id) }
    });

    if (!board) {
        return errors.makeNotFoundError(res, 'The board is not found.');
    }

    return res.json({
        success: true,
        data: board
    });
};

exports.getBoard = async (req, res) => {
    return res.json({
        success: true,
        data: req.board
    });
};

exports.updateBoard = async (req, res) => {
    if (!req.permissions.manage_boards) {
        return errors.makeForbiddenError(res, 'You are not allowed to update boards.');
    }

    await req.board.update(req.body);

    return res.json({
        success: true,
        data: req.board
    });
};

exports.deleteBoard = async (req, res) => {
    if (!req.permissions.manage_boards) {
        return errors.makeForbiddenError(res, 'You are not allowed to delete boards.');
    }

    await req.board.destroy();

    return res.json({
        success: true,
        data: req.board
    });
};
