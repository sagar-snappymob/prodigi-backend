import { prisma, Prisma } from '../db';
import logger from '../../logger';

export const wishlistService = {
  /**
   *
   * @description Getting list of wishlist for the authenticated user.
   */
  getMyWishList: (userId: number) => prisma.wishlist.findMany({ where: { userId }, include: { product: true } }),

  /**
   *
   * @description Add a product to the logged in user wishlist.
   */
  addProductToWishList: async (userId: number, productId: number) => {
    try {
      const wishlist = await prisma.wishlist.create({ data: { userId, productId } });
      logger.info('update product by id', { wishlist });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        /**
         * "Unique constraint failed on the {constraint}"
         * refer to https://www.prisma.io/docs/reference/api-reference/error-reference for more info for prisma error codes
         */
        if (e.code === 'P2002') {
          const message = 'This product is already exist in your wishlist.';
          throw new Error(message);
        }
      }
      throw e;
    }
  },

  /**
   *
   * @description Delete a product from the logged in user wishlist.
   */
  deleteWishListProduct: (id: number) => prisma.wishlist.delete({ where: { id } }),
};
