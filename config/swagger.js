const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Biblioteca API',
      version: '1.0.0',
      description: 'API para la gestión de la biblioteca, usuarios, libros y préstamos.',
    },
    servers: [
      {
        url: '/',
        description: 'Servidor actual',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Opciones para que funcione en Vercel (usa CDN en lugar de archivos locales del node_modules)
  const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css";
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customSiteTitle: "API Biblioteca Docs"
  }));
  console.log('📄 Swagger docs disponibles en /api-docs');
};

module.exports = swaggerDocs;
