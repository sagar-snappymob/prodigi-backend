import bodyParser from 'body-parser';
import cors from 'cors';
import { authentication, bodyValidate, httpLogger } from '../middlewares';
import healthController from '../controllers/healthController';
import userController from '../controllers/userController';
import productController from '../controllers/productController';
import wishListController from '../controllers/wishListController';

export default (app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(authentication);
  app.use(bodyValidate);
  app.use(httpLogger);

  /* below is the routing section */
  app.use('/health', healthController);
  app.use('/users', userController);
  app.use('/products', productController);
  app.use('/wishlist', wishListController);

  return app;
};
