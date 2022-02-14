import express from 'express';
import swaggerUi from 'swagger-ui-express';
import config from 'config';

import * as swaggerFile from '../../swagger.json';
import router from './router';
import logger from '../../logger';

const { port } = config.get('server');

const app = router(express());
app.listen(port, () => logger.info(`App started and listening on port ${port}`)); // for starting the app on the configured port -- default port is 8000
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // for starting the swagger as documentation
