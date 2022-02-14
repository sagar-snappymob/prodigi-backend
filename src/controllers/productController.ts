import express from 'express';
import { Request, Response } from 'express';
import { Role, Product } from '../db';
import { productService } from '../services';
import { authorization } from '../middlewares';
import { notFoundError, serverError } from '../exceptions';
import logger from '../../logger';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      query: { page = 1, size = 10 },
    } = req;
    /*  #swagger.tags = ['Products']
				#swagger.path = '/products'
				#swagger.description = 'Get liast of all products.'
				#swagger.parameters['page'] = {
					in: 'query',
					description: 'Page number',
				}
				#swagger.parameters['size'] = {
					in: 'query',
					description: 'Page size',
				}
		*/
    // getting total page and products list
    let [totalPage, products] = await productService.getAllProducts(Number(page), Number(size));
    products = products.map((product) => ({ ...product, image: JSON.parse(product.image) }));
    totalPage = Math.ceil(totalPage / Number(size));
    /*  #swagger.responses[200] = { 
				schema: { $ref: "#/definitions/productsResponse" },
				description: 'Successfully done.' 
			}
		*/
    return res.status(200).send({ data: products, page: Number(page), totalPage });
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

router.get('/most-viewed', async (req: Request, res: Response) => {
  try {
    const {
      query: { page = 1, size = 10 },
    } = req;
    /*  #swagger.tags = ['Products']
				#swagger.path = '/products/most-viewed'
				#swagger.description = 'list the most visited products.'
				#swagger.parameters['page'] = {
					in: 'query',
					description: 'Page number',
				}
				#swagger.parameters['size'] = {
					in: 'query',
					description: 'Page size',
				}
		*/
    // getting total pages and most viewed product
    let [totalPage, products] = await productService.getMostViewedProducts(Number(page), Number(size));
    products = products.map((product) => ({ ...product, image: JSON.parse(product.image) }));
    totalPage = Math.ceil(totalPage / Number(size));
    /*  #swagger.responses[200] = { 
				schema: { $ref: "#/definitions/productsResponse" },
				description: 'Successfully done' 
			}
		*/
    return res.status(200).send({ data: products, page: Number(page), totalPage });
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

router.post('/', authorization(Role.ADMIN), async (req: Request, res: Response) => {
  const { title, description, brand, type, price, discount, image } = req.body;
  try {
    /*  #swagger.tags = ['Products']
				#swagger.path = '/products'
				#swagger.description = 'Create a new product.'
				#swagger.parameters['obj'] = {
					in: 'body',
					description: 'Add new product',
					schema: { $ref: '#/definitions/addProduct' }
				}
				#swagger.responses[406] = { 
						schema: { $ref: "#/definitions/validationError" },
						description: 'Validation error.' 
				}
				#swagger.security = [{
					"bearerAuth": []
				}]
		*/
    // Creating new product
    const { id } = await productService.create({ title, description, brand, type, price, discount, image });
    /*  #swagger.responses[200] = { 
					schema: { $ref: "#/definitions/userResponse" },
					description: 'Successfully done.' 
				}
		*/
    return res.status(200).send({ data: id });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Unknown error.' 
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = serverError;
    return res.status(code).send(message);
  }
});

router.put('/:id', authorization(Role.ADMIN), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, brand, type, price, discount, image } = req.body;
  try {
    /*  #swagger.tags = ['Products']
				#swagger.path = '/products/{id}'
				#swagger.description = 'Update a product by id.'
				#swagger.parameters['id'] = {
					in: 'path',
					description: 'Product id',
				}
				#swagger.parameters['obj'] = {
					in: 'body',
					description: 'Product data',
					schema: { $ref: '#/definitions/addProduct' }
				}
				#swagger.responses[406] = { 
						schema: { $ref: "#/definitions/validationError" },
						description: 'Validation error.' 
				}
		*/
    // Updating existing product
    const product = await productService.updateProductById(Number(id), {
      title,
      description,
      brand,
      type,
      price,
      discount,
      image: JSON.stringify(image),
    } as Product);
    /*  #swagger.responses[200] = { 
				schema: { $ref: "#/definitions/productResponse" },
				description: 'Successfully done.' 
			}
		*/
    return res.status(200).send({ data: product });
  } catch (e) {
    /*  #swagger.responses[404] = { 
					schema: { $ref: "#/definitions/productNotFound" },
					description: 'Product Not Found.' 
				}
		*/
    const errorMessage = e.message;
    logger.error(errorMessage, { path: req.url });
    const { code, message } = notFoundError(errorMessage);
    return res.status(code).send(message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    /*  #swagger.tags = ['Products']
				#swagger.path = '/products/{id}'
				#swagger.description = 'Get product by id.'
				#swagger.parameters['id'] = {
					in: 'path',
					description: 'Product id',
				}
		*/
    // Get product by ID
    const product = await productService.getProductById(Number(id));
    /*  #swagger.responses[200] = { 
				schema: { $ref: "#/definitions/loginResponse" },
				description: 'Successfully done.' 
			}
		*/
    return res.status(200).send({ data: product });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Unknown error.' 
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = serverError;
    return res.status(code).send(message);
  }
});

export default router;
