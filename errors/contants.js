exports.errorName = {
  UNAUTHORIZED: "UNAUTHORIZED",
  USER_NOT_EXIST: "USER_NOT_EXIST",
  USER_EXIST: "USER_EXIST",
};

exports.errorType = {
  ERROR_NOT_DEFINED: {
    message: "The error is not defined!",
    statusCode: 500,
  },
  UNAUTHORIZED: {
    message: "Credential invalid.",
    statusCode: 401,
  },
  USER_NOT_EXIST: {
    message: "User dose not exists!",
    statusCode: 404,
  },
  USER_EXIST: {
    message: "User already exists.",
    statusCode: 403,
  },
};
