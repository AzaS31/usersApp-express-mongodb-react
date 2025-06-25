const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users API',
      version: '1.0.0',
      description: 'Документация API для управления пользователями',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'secondName', 'age', 'city', 'email', 'password'],
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
            },
            secondName: {
              type: 'string',
              example: 'Doe',
            },
            age: {
              type: 'integer',
              example: 30,
            },
            city: {
              type: 'string',
              example: 'Astana',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // путь к файлам с описанием роутов
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
