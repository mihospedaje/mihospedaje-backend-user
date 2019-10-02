'use strict';

const response = require('../../utils/response')
const { STATUS_CODES } = require('../../utils/constants')

const ok = async (req, res, next) => {
	response.success(res, STATUS_CODES.OK, {
		status: "OK"
	})
}

module.exports = {
	ok
}