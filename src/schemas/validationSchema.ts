import Joi from 'joi';
import { Role } from '@prisma/client';

/**
 * this schema is for dynamic body validation
 * this contains route:methode
 * just remove / in rotes and path params like :id
 */
export const schema = {
  'users:post': Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid(Role.ADMIN, Role.USER).required(),
  }),
  'users:login:post': Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  'products:post': Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    type: Joi.string().required(),
    price: Joi.number().min(1).required(),
    discount: Joi.number().min(0).required(),
    image: Joi.array().items(Joi.string()).min(3).required(),
  }),
  'products:put': Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    brand: Joi.string(),
    type: Joi.string(),
    price: Joi.number().min(1),
    discount: Joi.number().min(0),
    image: Joi.array().items(Joi.string()).min(3),
  }),
  'wishlist:post': Joi.object({
    productId: Joi.number().integer().min(1),
  }),
};

export type Key = keyof typeof schema;
