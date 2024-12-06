const scheduler = require('node-schedule');
const moment = require('moment');

const logger = require('./logger');
const { Board } = require('../models');
const boards = require('./boards');

const JobCallbacks = {
    NEW_BOARD_EMAIL: async ({ id }) => {
        const board = await Board.findByPk(id);

        if (!board) {
            logger.warn({ id }, 'Sending new board email: Board is not found.');
            return;
        }

        await boards.sendNewBoardEmail(id);
        logger.info({ board }, 'Sending new board email: Successfully sent new board email');
    }
};

class JobManager {
    constructor() {
        this.jobs = {};
        this.currentJob = 0;

        this.JOB_TYPES = {
            NEW_BOARD_EMAIL: {
                key: 'NEW_BOARD_EMAIL',
                description: 'New board email',
                callback: JobCallbacks.NEW_BOARD_EMAIL
            }
        };
    }

    addJob(jobType, time, params) {
        const {
            description,
            callback,
            key
        } = jobType;

        if (moment().isAfter(time)) {
            logger.warn({
                description,
                scheduled_on: moment(time).format('YYYY-MM-DD HH:mm:SS'),
                params
            }, 'Job is not added: is in the past, not scheduling.');
            return;
        }

        const id = ++this.currentJob;

        scheduler.scheduleJob(time, () => this.executeJob(id));

        this.jobs[id] = {
            key,
            description,
            time,
            params,
            id,
            callback
        };
        logger.info({
            id,
            description,
            scheduled_on: moment(time).format('YYYY-MM-DD HH:mm:SS'),
            params
        }, 'Added a job');
        return id;
    }

    async executeJob(id) {
        const job = this.jobs[id];
        if (!job) {
            logger.warn({ id }, 'Job is not found.');
            return;
        }

        logger.info({ job }, 'Executing job');
        await job.callback(job.params);
        logger.info({ job }, 'Executed job');
        delete this.jobs[id];
    }

    cancelJob(id) {
        const job = this.jobs[id];
        if (!job) {
            logger.warn({ id }, 'Job is not found.');
            return;
        }

        logger.info({ job }, 'Cancelling job');
        scheduler.cancelJob(job.job);
        delete this.jobs[id];
    }

    // eslint-disable-next-line class-methods-use-this
    async registerAllDeadlines() {
        const allBoards = await Board.findAll({});
        logger.info({ count: allBoards.length }, 'Registering start dates for boards...');
        for (const board of allBoards) {
            // Triggering model update to run hooks to set start dates.
            board.changed('id', true);
            await board.save();
        }
    }

    clearJobs(key, params) {
        const ids = Object.keys(this.jobs);
        for (const id of ids) {
            const job = this.jobs[id];

            if (job.key !== key.key) {
                continue;
            }

            if (params.id !== job.params.id) {
                continue;
            }

            this.cancelJob(id);
        }
    }

    clearAll() {
        const ids = Object.keys(this.jobs);
        for (const id of ids) {
            this.cancelJob(id);
        }
    }
}

const manager = new JobManager();
module.exports = manager;
