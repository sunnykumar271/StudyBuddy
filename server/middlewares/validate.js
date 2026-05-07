const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors
          .array()
          .map((e) => e.msg)
          .join(', '),
        errors: errors.array(),
      });
    }

    next();
  };
};

module.exports = validate;
