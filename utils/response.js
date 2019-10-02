'use strict';

const { STATUS_CODES } = require('./constants');

const success = function (res, status, data) {
    return res.status(status).send({
        data: data
    })
}

const error = function (res, status, message) {
    return res.status(status).send({
        data: {
            error: message
        }
    })
}

const emptySuccess = function (res, status = STATUS_CODES.OK) {
    return res.status(status).send();
}

module.exports = {
    success,
    error,
    emptySuccess
}