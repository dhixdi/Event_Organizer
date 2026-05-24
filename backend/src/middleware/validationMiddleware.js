const { errorResponse } = require('../utils/response');

function formatJoiErrors(error) {
  if (!error?.details) {
    return [];
  }

  return error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
  }));
}

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const target = req[source];
    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return errorResponse(res, {
        message: 'Validasi request gagal',
        statusCode: 400,
        errors: formatJoiErrors(error),
      });
    }

    req[source] = value;
    return next();
  };
}

module.exports = { validate };
