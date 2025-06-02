import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WADS Backend API Documentation',
      version: '1.0.0',
      description: 'API documentation for the WADS Backend service',
      contact: {
        name: 'API Support',
        email: 'support@wads.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ], // Path to the API docs
};

export const specs = swaggerJsdoc(options); 