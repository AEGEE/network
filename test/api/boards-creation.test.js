const moment = require('moment');
const faker = require('faker');

const { startServer, stopServer } = require('../../lib/server.js');
const { request } = require('../scripts/helpers');
const mock = require('../scripts/mock');
const generator = require('../scripts/generator');

describe('Boards creation', () => {
    beforeAll(async () => {
        await startServer();
    });

    afterAll(async () => {
        await stopServer();
    });

    beforeEach(async () => {
        mock.mockAll();
    });

    afterEach(async () => {
        mock.cleanAll();
        await generator.clearAll();
    });

    test('should fail if endpoint does not exist', async () => {
        const board = generator.createBoard();

        const res = await request({
            uri: '/bodies/1/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body.success).toEqual(false);
    });

    test('should fail if no permissions', async () => {
        mock.mockAll({ mainPermissions: { noPermissions: true } });

        const board = generator.createBoard();

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(403);
        expect(res.body.success).toEqual(false);
    });

    test('should fail if body_id is not set', async () => {
        const board = generator.createBoard({ body_id: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('body_id');
    });

    test('should fail if body_id is not a number', async () => {
        const board = generator.createBoard({ body_id: 'NaN' });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('body_id');
    });

    test('should fail if elected_date is not set', async () => {
        const board = generator.createBoard({ elected_date: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('elected_date');
    });

    test('should fail if elected_date is in the future', async () => {
        const board = generator.createBoard({ elected_date: faker.date.future() });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('elected_date');
    });

    test('should fail if start_date is not set', async () => {
        const board = generator.createBoard({ start_date: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('start_date');
    });

    test('should fail if end_date is in the past', async () => {
        const board = generator.createBoard({ end_date: faker.date.past() });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('end_date');
    });

    test('should fail if president is not set', async () => {
        const board = generator.createBoard({ president: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('president');
    });

    test('should fail if president is not a number', async () => {
        const board = generator.createBoard({ president: 'NaN' });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('president');
    });

    test('should fail if secretary is not set', async () => {
        const board = generator.createBoard({ secretary: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('secretary');
    });

    test('should fail if secretary is not a number', async () => {
        const board = generator.createBoard({ secretary: 'NaN' });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('secretary');
    });

    test('should fail if treasurer is not set', async () => {
        const board = generator.createBoard({ treasurer: null });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('treasurer');
    });

    test('should fail if treasurer is not a number', async () => {
        const board = generator.createBoard({ treasurer: 'NaN' });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('treasurer');
    });

    test('should fail if image_id is not a number', async () => {
        const board = generator.createBoard({ image_id: 'NaN' });

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.success).toEqual(false);
        expect(res.body).toHaveProperty('errors');
        expect(res.body).not.toHaveProperty('data');
        expect(res.body.errors).toHaveProperty('image_id');
    });

    test('should succeed if everything is okay', async () => {
        const board = generator.createBoard();

        const res = await request({
            uri: '/bodies/' + body.id + '/boards',
            method: 'POST',
            body: board,
            headers: { 'X-Auth-Token': 'blablabla' }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
    })
});
