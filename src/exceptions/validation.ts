/**
 * @description this function will generate validation error message to return.
 */
export const validationError = (message: string) => ({
  message: {
    error_code: 'VALIDATION_ERROR',
    message,
  },
  code: 406,
});
