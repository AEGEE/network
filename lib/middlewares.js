const request = require('request-promise-native');

const core = require('./core');
const errors = require('./errors');
const helpers = require('./helpers');
const logger = require('./logger');
const config = require('../config');
const Bugsnag = require('./bugsnag');
const packageInfo = require('../package.json');
const cron = require('./cron');

exports.authenticateUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return errors.makeError(res, 401, 'No auth token provided');
    }

    const [userBody, permissionsBody] = await Promise.all([
        core.getMyProfile(req),
        core.getMyPermissions(req)
    ]);

    // Fetching permissions for board management, the list of bodies
    // where do you have the 'manage_network:boards' permission for it.
    const manageRequest = await request({
        url: config.core.url + ':' + config.core.port + '/my_permissions',
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Auth-Token': req.headers['x-auth-token'],
        },
        simple: false,
        json: true,
        body: {
            action: 'manage_network',
            object: 'boards'
        },
        resolveWithFullResponse: true
    });

    req.manageRequest = manageRequest;

    if (typeof userBody !== 'object') {
        throw new Error('Malformed response when fetching user: ' + userBody);
    }

    // We only check user body here and not in the core helper
    // because if not authorized, we need to return 401.
    if (!userBody.success) {
        // We are not authenticated
        return errors.makeUnauthorizedError(res, 'Error fetching user: user is not authenticated.');
    }

    if (typeof permissionsBody !== 'object') {
        throw new Error('Malformed response when fetching permissions: ' + permissionsBody);
    }

    // Same store as with user body request.
    if (!permissionsBody.success) {
        return errors.makeUnauthorizedError(res, 'Error fetching permissions: user is not authenticated.');
    }

    req.user = userBody.data;
    req.corePermissions = permissionsBody.data;
    if (req.manageRequest.body && req.manageRequest.body.success) req.managePermissions = manageRequest.body.data;
    req.permissions = helpers.getPermissions(req.user, req.corePermissions, req.managePermissions);

    return next();
};

exports.ensureAuthorized = async (req, res, next) => {
    // If any of the services returned HTTP 401, then we are not authorized.
    if (
        req.userRequest.statusCode === 401
      || req.permissionsRequest.statusCode === 401
      || (req.approveRequest && req.approveRequest.statusCode === 401)
    ) {
        return errors.makeUnauthorizedError(res, 'Error fetching data: user is not authenticated.');
    }

    return next();
};

/* istanbul ignore next */
exports.healthcheck = (req, res) => {
    return res.json({
        success: true,
        data: {
            name: packageInfo.name,
            description: packageInfo.description,
            version: packageInfo.version
        }
    });
};

/* istanbul ignore next */
exports.getTasksList = (req, res) => {
    if (!req.permissions.see_background_tasks) {
        return errors.makeForbiddenError(res, 'You cannot see background tasks.');
    }

    return res.json({
        success: true,
        data: cron.jobs
    });
};

/* eslint-disable no-unused-vars */
exports.notFound = (req, res, next) => errors.makeNotFoundError(res, 'No such API endpoint: ' + req.method + ' ' + req.originalUrl);

/* eslint-disable no-unused-vars */
exports.errorHandler = (err, req, res, next) => {
    // Handling invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return errors.makeBadRequestError(res, 'Invalid JSON.');
    }

    // Handling validation errors
    if (err.name && ['SequelizeValidationError', 'SequelizeUniqueConstraintError'].includes(err.name)) {
        return errors.makeValidationError(res, err);
    }

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') {
        Bugsnag.notify(err);
    }

    /* istanbul ignore next */
    logger.error({ err }, 'Unhandled error');
    /* istanbul ignore next */
    return errors.makeInternalError(res, err);
};
