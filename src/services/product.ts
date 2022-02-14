import { prisma, Prisma, Product } from '../db';
import logger from '../../logger';

export const productService = {
  /**
   *
   * @description creating a new product with all request param. accessible with admin role only.
   */
  create: async ({ title, description, brand, type, price, discount, image }: NewProduct) => {
    try {
      // Creating new product
      const product = await prisma.product.create({
        data: {
          title,
          description,
          brand,
          type,
          price,
          discount,
          image: JSON.stringify(image),
        },
      });
      logger.info('create a new product', { product });
      return product;
    } catch (e) {
      throw e;
    }
  },

  /**
   *
   * @description getting list of all products with pagination
   */
  getAllProducts: (page = 1, size = 10) =>
    prisma.$transaction([
      prisma.product.count(),
      prisma.product.findMany({
        skip: (page - 1) * size,
        take: size,
      }),
    ]),

  /**
   *
   * @description getting the most visited products with pagination
   */
  getMostViewedProducts: (page = 1, size = 10) =>
    prisma.$transaction([
      prisma.product.count(),
      prisma.product.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: { visited: 'desc' },
      }),
    ]),

  /**
   *
   * @description getting a product base on ID.
   */
  getProductById: async (id: number) => {
    // getting product by id
    const [_, product] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: { visited: { increment: 1 } },
      }),
      prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          brand: true,
          type: true,
          price: true,
          discount: true,
          image: true,
        },
      }),
    ]);
    product.image = JSON.parse(product.image);

    return product;
  },

  /**
   *
   * @description updating a product based on ID.
   */
  updateProductById: async (id: number, data: Product) => {
    try {
      // Updating product by ID
      const product = await prisma.product.update({ where: { id }, data });
      logger.info('update product by id', { product });
      delete product.visited;
      product.image = JSON.parse(product.image);
      return product;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        /**
         * An operation failed because it depends on one or more records that were required but not found. {cause}
         * refer to https://www.prisma.io/docs/reference/api-reference/error-reference for more info for prisma error codes
         */
        if (e.code === 'P2025') {
          const message = `product id ${id} is not valid.`;
          throw new Error(message);
        }
      }
      throw e;
    }
  },
};

export interface NewProduct {
  title: string;
  description: string;
  brand: string;
  type: string;
  price: number;
  discount: number;
  image: string[];
}
