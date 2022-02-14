import { Request, Response, NextFunction } from 'express';
import { schema, Key } from '../schemas/validationSchema';
import logger from '../../logger';
import { validationError } from '../exceptions';

/**
 *
 * @description dynamic request body validator based on schemas.
 */
export const bodyValidate = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.url
    .split('/')
    .filter((i) => i && !Number(i))
    .join(':');
  const key = `${path}:${req.method.toLowerCase()}` as Key;
  if (schema[key]) {
    const result = schema[key].validate(req.body || req.query);
    if ('error' in result) {
      logger.error(`data is not valid => ${result?.error?.message}`, { path: req.url });
      const { code, message } = validationError(result?.error?.message.replace(/"/g, "'"));
      return res.status(code).send(message);
    }
  }
  return next();
};
