const { validationResult } = require('express-validator');

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  console.log("Validation Errors: ", errors.array());
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  next();
};

module.exports = validateMiddleware;