const faker = require('faker');

const { Board } = require('../../models');

const notSet = (field) => typeof field === 'undefined';

exports.generateBoard = (options = {}) => {
    if (notSet(options.body_id)) options.body_id = faker.random.number(100);
    if (notSet(options.elected_date)) options.elected_date = faker.date.past();
    if (notSet(options.start_date)) options.start_date = faker.date.recent(5);
    if (notSet(options.president)) options.president = faker.random.number(4);
    if (notSet(options.secretary)) options.secretary = faker.random.number(4);
    if (notSet(options.treasurer)) options.treasurer = faker.random.number(4);

    return options;
};

exports.createBoard = (options = {}, body) => {
    return Board.create(exports.generateBoard(options, body));
};

exports.clearAll = async () => {
    await Board.destroy({ where: {}, truncate: { cascade: true } });
};
