/**
 * @description this function will generate not fount error message to return.
 */
export const notFoundError = (message = 'Data not found for the specified resource') => ({
  message: {
    error_code: 'DATA_NOT_FOUND_ERROR',
    message,
  },
  code: 404,
});

/**
 * @description this function will generate server error message to return.
 */
export const serverError = {
  message: { error_code: 'SERVER_ERROR', message: 'Internal server error' },
  code: 500,
};

/**
 * @description this function will generate unprocessable entity message to return.
 */
export const unprocessableEntity = {
  message: { error_code: 'UNPROCESSABLE_ENTITY', message: 'Unprocessable Entity' },
  code: 500,
};
