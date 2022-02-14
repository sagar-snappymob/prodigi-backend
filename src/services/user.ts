import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { prisma, Prisma, Role } from '../db';
import logger from '../../logger';

const service = { service: 'user-service' };
const { hashSalt, jwtExp, jwtSecret } = config.get('app');

export const userService = {
  /**
   *
   * @description Creating new user with email name role and pwd param. only accessible with admin role
   */
  create: async (email: string, pwd: string, name: string, role: Role) => {
    const password = await userService.generateHash(pwd);

    try {
      // Creating new user with email, name, role and password param
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          role,
        },
      });
      logger.info('Creating new user', { user });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        /**
         * "Unique constraint failed on the {constraint}"
         * refer to https://www.prisma.io/docs/reference/api-reference/error-reference for more info for prisma error codes
         */
        if (e.code === 'P2002') {
          const message = 'a user with this email is already exist.';
          logger.error(message, service);
          throw new Error(message);
        }
      }
      throw e;
    }
  },

  /**
   *
   * @description generate new hash code with bycrpt
   */
  generateHash: async (password: string) => {
    const salt = await bcrypt.genSalt(Number(hashSalt));
    return bcrypt.hash(password, salt);
  },

  /**
   *
   * @description comparing 2 passwords
   */
  compareHash: (p1: string, p2: string) => bcrypt.compare(p1, p2),

  /**
   *
   * @description create new JWT token
   */
  createJwtToken: (data: { email: string; role: string }) =>
    jwt.sign(
      {
        exp: Number(jwtExp),
        data,
      },
      jwtSecret
    ),

  /**
   *
   * @description get user by email address
   */
  getUserByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, select: { id: true, email: true, password: true, role: true } }),
};
