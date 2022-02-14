import express from 'express';
import { wishlistService, userService } from '../services';
import { checkAuth } from '../middlewares';
import { validationError, serverError } from '../exceptions';
import logger from '../../logger';

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  /*  #swagger.tags = ['Wish List']
			#swagger.path = '/wishlist'
			#swagger.description = 'Get list of Wish List.'
				#swagger.security = [{
					"bearerAuth": []
				}]
	*/
  try {
    // Getting user object by email address
    const { id: userId } = await userService.getUserByEmail(req.userInfo.email);
    // Getting wishlist by userId
    const wishList = await wishlistService.getMyWishList(userId);
    return res.status(200).send({ data: wishList });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Unknown error' 
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = serverError;
    return res.status(code).send(message);
  }
});

router.post('/', checkAuth, async (req, res) => {
  const { productId } = req.body;
  try {
    /*  #swagger.tags = ['Wish List']
				#swagger.path = '/wishlist'
				#swagger.description = 'Add product to Wish List.'
				#swagger.parameters['obj'] = {
					in: 'body',
					description: 'Add new wish list',
					schema: { $ref: '#/definitions/addWishList' }
				}
				#swagger.responses[406] = { 
						schema: { $ref: "#/definitions/validationError" },
						description: 'Validation error.' 
				}
				#swagger.security = [{
					"bearerAuth": []
				}]
		*/
    // Getting user object by email address
    const { id: userId } = await userService.getUserByEmail(req.userInfo.email);
    // Adding product in wishlist
    await wishlistService.addProductToWishList(userId, productId);
    /*  #swagger.responses[200] = { 
					schema: { data: true },
					description: 'Successfully done.' 
				}
		*/
    return res.status(200).send({ data: true });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Invalid Data' 
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = validationError(e.message);
    return res.status(code).send(message);
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  /*  #swagger.tags = ['Wish List']
				#swagger.path = '/wishlist/{id}'
				#swagger.description = 'Delete product from Wish List.'
				#swagger.parameters['id'] = {
					in: 'path',
					description: 'A delete wish list',
				}
				#swagger.security = [{
					"bearerAuth": []
				}]
	*/
  try {
    // Deleting existing product from withlist
    const response = await wishlistService.deleteWishListProduct(Number(id));
    /*  #swagger.responses[200] = { 
					schema: { $ref: "#/definitions/deleteWishlistResponse" },
					description: 'Successfully done.' 
				}
		*/
    return res.status(200).send({ data: response });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Invalid Data' 
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = validationError(e.message);
    return res.status(code).send(message);
  }
});

export default router;
