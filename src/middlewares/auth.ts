import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { unauthorizedError } from '../exceptions';
import config from 'config';
import logger from '../../logger';

const { jwtSecret } = config.get('app');

/**
 *
 * @description this function will verify and decode the JWT token and add some important data in to the request object.
 */
export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('authorization');
  req.userInfo = null;
  if (authHeader) {
    const jwtToken = authHeader.replace('Bearer ', '');
    try {
      const decoded: any = jwt.verify(jwtToken, jwtSecret);
      console.log(decoded);
      req.userInfo = { ...decoded.data };
    } catch (ex) {
      logger.error(ex.message, { path: req.url });
      const { code, message } = unauthorizedError('Invalid Token.');
      return res.status(code).send(message);
    }
  }
  return next();
};

/**
 *
 * @description this function will authorize the user based on role.
 */
export const authorization = (role: Role) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.userInfo || req.userInfo.role !== role) {
    const { code, message } = unauthorizedError('Access to this resource was denied.');
    return res.status(code).send(message);
  }
  return next();
};

/**
 *
 * @description this function will check and confirm that the user is logged in.
 */
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userInfo) {
    const { code, message } = unauthorizedError('You are not logged in.');
    return res.status(code).send(message);
  }
  return next();
};

export type UserInfo = {
  email: string;
  role: Role;
};
