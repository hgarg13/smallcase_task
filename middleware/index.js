const middlewareObj = {};

/**
 * @description: General function to set status and send response
 * @param {*} req 
 * @param {*} res 
 * @param {*} data 
 */
middlewareObj.sendResponse = function (req, res, data) {
	let resObj = {
		err: data.error,
		message: data.message,
		data: data.data || []
	}
	return res.status(data.statusCode).send(resObj);
}

module.exports = middlewareObj;