"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Konfigurasi CORS
    app.enableCors({
        origin: '*', // Bisa diubah sesuai kebutuhan
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NugraJS API')
        .setDescription('API documentation powered by Swagger')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3000);
}
bootstrap();
