'use strict';

const response = require('../utils/response');
const { STATUS_CODES } = require('../utils/constants');

const error = function (err, req, res, next) {
    console.log(err)
    const code = err.status || err.statusCode || STATUS_CODES.INTERNAL_SERVER
    const error = {
        message: err.message,
        code: code
    }

    return response.error(res, code, error)
}

const wrapper = function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err)
        });
    };
}

module.exports = {
    error,
    wrapper
}