import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) =>
  /*  #swagger.tags = ['Health']
      #swagger.path = '/health'
      #swagger.description = 'Health check endpoint.'
	*/
  res.send('Success!')
);

export default router;
