const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'API for Books + Authentication'
    },
    servers: [
      {
        url: 'http://localhost:3333'
      }
    ],

    tags: [
      { name: 'Authentication', description: 'User authentication' },
      { name: 'Books', description: 'Books CRUD operations' }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            fname: { type: 'string' },
            lname: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
          }
        },

        RegisterRequest: {
          type: 'object',
          required: ['fname', 'lname', 'username', 'email', 'password'],
          properties: {
            fname: { type: 'string' },
            lname: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },

        LoginRequest: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          }
        },

        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },

        CreateBook: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            genre: { type: 'string' },
            description: { type: 'string' },
            rating: { type: 'number' }
          }
        },

        UpdateBook: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            genre: { type: 'string' },
            description: { type: 'string' },
            rating: { type: 'number' }
          }
        }
      }
    }
  },

  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);