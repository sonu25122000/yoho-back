"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swaggerJSDoc = require("swagger-jsdoc");
// swagger definition ncjdkc
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "YOHO Api Docs",
        version: "1.0.0",
        description: "This is a REST API application made with Express. It retrieves data from YOHO.",
        contact: {
            name: "YOHO",
            url: "#",
        },
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Development server",
        },
        // {
        //   url: "http://pms-api.stg.fashquik.com:5000",
        //   description: "production server",
        // },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                in: "header",
                name: "Authorization",
                description: "Bearer token to access these api endpoints",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ["app/**/*.ts"],
};
exports.swaggerSpec = swaggerJSDoc(options);
