const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Online Shop API',
    description: `Online Shop API is an online shopping festival.`,
  },
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  host: 'localhost:8000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    addUser: {
      name: 'Sagar Dave',
      email: 'sagar@snappymob.com',
      password: 'Admin@123',
    },
    addWishList: {
      productId: 1,
    },
    login: {
      email: 'sagar@snappymob.com',
      password: 'Admin@123',
    },
    addProduct: {
      title: 'Bags',
      description: 'Laptop Backpack Academy Backpack',
      brand: 'PUMA',
      type: 'Accessories',
      price: 200,
      discount: 9.99,
      image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
    },
    productResponse: {
      id: 1,
      title: 'Bags',
      description: 'Laptop Backpack Academy Backpack',
      brand: 'PUMA',
      type: 'Accessories',
      price: 200,
      discount: 9.99,
      image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
    },
    productsResponse: {
      data: [
        {
          id: 1,
          title: 'Bags',
          description: 'Laptop Backpack Academy Backpack',
          brand: 'PUMA',
          type: 'Accessories',
          price: 200,
          discount: 9.99,
          image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
        },
      ],
      page: 1,
      totalPage: 1,
    },
    deleteWishlistResponse: { id: 6, userId: 32, productId: 1 },
    userResponse: {
      id: 1,
    },
    loginResponse: {
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDQyOTE1NDAsImRhdGEiOnsiZW1haWwiOiJhbWlyQHNuYXBweW1vYi5jb20ifSwiaWF0IjoxNjQ0Mjg3OTQwfQ.qBWLH4kK-NNvAIa78yMFoNkfm9DIgPg8eilE1PU1xGk',
    },
    productNotFound: {
      error_code: 'DATA_NOT_FOUND_ERROR',
      message: 'product id is not valid.',
    },
    notFoundError: {
      error_code: 'DATA_NOT_FOUND_ERROR',
      message: 'Could not find any data',
    },
    serverError: {
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    },
    validationError: {
      error_code: 'VALIDATION_ERROR',
      message: 'Data is not valid.',
    },
    unauthorizedError: {
      error_code: 'UNAUTHORIZED_ERROR',
      message: "Access to this resource was denied.",
    },
    unprocessableEntity: {
      error_code: 'UNPROCESSABLE_ENTITY',
      message: "Unprocessable Entity.",
    },
  },
};

swaggerAutogen(outputFile, ['./src/routes/*'], doc);
