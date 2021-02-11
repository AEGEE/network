const moment = require('moment');

const { startServer, stopServer } = require('../../lib/server.js');
const { request } = require('../scripts/helpers');
const mock = require('../scripts/mock');
const generator = require('../scripts/generator');

describe('Boards listing', () => {
    beforeEach(async () => {
        mock.mockAll();
        await startServer();
    });

    afterEach(async () => {
        await stopServer();
        mock.cleanAll();

        await generator.clearAll();
    });

    it('should list all boards on / GET', async () => {
        await generator.createBoard();
        await generator.createBoard();

        const res = await request({
            uri: '/',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(2);
    });

    it('should list all boards on /:body_id GET', async () => {
        await generator.createBoard({ body_id: 1 });
        await generator.createBoard({ body_id: 1 });
        await generator.createBoard({ body_id: 2 });

        const res = await request({
            uri: '/1',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(2);
    });

    it('should sort boards properly on / GET', async () => {
        const first = await generator.createBoard({
            start_date: moment().add(2, 'years').toDate()
        });
        const third = await generator.createBoard({
            start_date: moment().toDate()
        });
        const second = await generator.createBoard({
            start_date: moment().add(1, 'year').toDate()
        });

        const res = await request({
            uri: '/',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(3);

        expect(res.body.data[0].id).toEqual(first.id);
        expect(res.body.data[1].id).toEqual(second.id);
        expect(res.body.data[2].id).toEqual(third.id);
    });

    it('should sort boards properly on /:body_id GET', async () => {
        const first = await generator.createBoard({
            body_id: 1,
            start_date: moment().add(2, 'years').toDate()
        });
        const third = await generator.createBoard({
            body_id: 1,
            start_date: moment().toDate()
        });
        const second = await generator.createBoard({
            body_id: 1,
            start_date: moment().add(1, 'year').toDate()
        });
        await generator.createBoard({ body_id: 2 });

        const res = await request({
            uri: '/1',
            method: 'GET',
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toEqual(3);

        expect(res.body.data[0].id).toEqual(first.id);
        expect(res.body.data[1].id).toEqual(second.id);
        expect(res.body.data[2].id).toEqual(third.id);
    });

});
