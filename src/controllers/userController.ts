import express from 'express';
import { Request, Response } from 'express';
import { Role } from '../db';
import { userService } from '../services';
import { authorization } from '../middlewares';
import { serverError, unauthorizedError, validationError } from '../exceptions';
import logger from '../../logger';

const router = express.Router();

router.post('/', authorization(Role.ADMIN), async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    /*  #swagger.tags = ['Users']
				#swagger.path = '/users'
				#swagger.parameters['obj'] = {
					in: 'body',
					description: 'Add new user',
					schema: { $ref: '#/definitions/addUser' }
				}
				#swagger.responses[406] = {
					schema: { $ref: "#/definitions/validationError" },
					description: 'Validation error.' 
				}
				#swagger.security = [{
					"bearerAuth": []
				}]
		*/
    // Creating new user
    const { id } = await userService.create(email, password, name, role);
    /*  #swagger.responses[200] = { 
					schema: { $ref: "#/definitions/userResponse" },
					description: 'Successfully done.' 
				}
		*/
    return res.status(200).send({ data: id });
  } catch (e) {
    /*  #swagger.responses[500] = { 
					schema: { $ref: "#/definitions/serverError" },
					description: 'Unknown error'
				}
		*/
    logger.error(e.message, { path: req.url });
    const { code, message } = validationError(e.message);
    return res.status(code).send(message);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    /*  #swagger.tags = ['Users']
				#swagger.path = '/users/login'
				#swagger.parameters['obj'] = {
					in: 'body',
					description: 'Login',
					schema: { $ref: '#/definitions/login' }
				}
				#swagger.responses[406] = { 
					schema: { $ref: "#/definitions/validationError" },
					description: 'Validation error.' 
				}
		*/
    //get User object by email address
    const userInfo = await userService.getUserByEmail(email);

    // If user not found or password is wrong then throw unauthorized error
    if (!userInfo || !(await userService.compareHash(password, userInfo.password))) {
      /*  #swagger.responses[401] = { 
					schema: { $ref: "#/definitions/unauthorizedError" },
					description: 'Not found error.' 
				}
			*/
      const { code, message } = unauthorizedError('Invalid credential!');
      return res.status(code).send(message);
    }

    // Creating token with email and user role
    const token = userService.createJwtToken({ email, role: userInfo.role });
    /*  #swagger.responses[200] = { 
				schema: { $ref: "#/definitions/loginResponse" },
				description: 'Successfully done.' 
			}
		*/
    return res.status(200).send({ data: token });
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

export default router;
