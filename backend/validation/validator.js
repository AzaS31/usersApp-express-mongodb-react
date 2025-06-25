function checkParams(scheme) {
  return (req, res, next) => {
    const validationResult = scheme.validate(req.params);
    if (validationResult.error) {
      const err = new Error(validationResult.error.message); 
      err.status = 400;
      return next(err);
    }
    next();
  };
}

function checkBody(scheme) {
  return (req, res, next) => {
    const validationResult = scheme.validate(req.body);
    if (validationResult.error) {
      const err = new Error(validationResult.error.message);
      err.status = 400;
      return next(err);
    }
    next();
  };
}

module.exports = { checkParams, checkBody };