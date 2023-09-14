const errorHandler = (errorCheck, errorResponse, errorCode) => {
  if (errorCheck) {
    const error = new Error(errorResponse);
    error.statudCode = errorCode;
    throw error;
  }
};

module.exports = {
  errorHandler,
};
