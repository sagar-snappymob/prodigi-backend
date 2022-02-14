/**
 * @description this function will generate unauthorizrd error message to return.
 */
export const unauthorizedError = (message = 'Access to this resource was denied.') => ({
  message: {
    error_code: 'UNAUTHORIZED_ERROR',
    message,
  },
  code: 401,
});
