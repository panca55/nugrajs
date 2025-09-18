

# NugraJS

NugraJS is a fullstack monorepo framework based on TypeScript, designed to accelerate modern web application development. It integrates a **NestJS** backend (TypeORM, Swagger, JWT) and frontend (**React**, **Vue**, or **Angular**) with a powerful CLI for automating module generation, database migration, and project configuration. NugraJS supports monorepo architecture, API proxying, Swagger documentation, and automatic CORS and JWT management.

This framework is developed by **Panca Nugraha**.

![Fullstack](https://img.shields.io/badge/-Fullstack-blue) 
![Monorepo](https://img.shields.io/badge/-Monorepo-blue) 
![TypeScript](https://img.shields.io/badge/-TypeScript-blue) 
![React](https://img.shields.io/badge/-React-blue) 
![Angular](https://img.shields.io/badge/-Angular-blue)
![Vue](https://img.shields.io/badge/-Vue-blue)  
![NestJS](https://img.shields.io/badge/-NestJS-blue) 
![Turborepo](https://img.shields.io/badge/-Turborepo-blue)

---

## Installation

```bash
npx nugrajs create <project-name>
```

---

## CLI Commands


### Project Initialization
```bash
nugra create <project-name>
```
Interactive project setup. Choose frontend framework (**React**, **Vue**, **Angular**).


### Model-Driven Workflow

#### 1. Generate Model
```bash
nugra generate entity <name>
```
Creates a model file in `App/models/<name>.model.ts`. You can manually edit the model to add fields and relations. The `id` field is always a UUID and auto-generated on insert.

#### 2. Generate CRUD, UI, and Database from Model
```bash
nugra generate crud <name>
```
Generates backend CRUD (NestJS), frontend components (React/Vue/Angular), and database logic based on the model in `App/models`.

#### 3. Regenerate After Model Changes
```bash
nugra regenerate crud <name>
```
Regenerates backend, frontend, and database files if you update the model. Foreign key relations are detected automatically if your model references another class/interface.

**Example:**
```bash
nugra generate entity user
# Edit App/models/user.model.ts to add fields
nugra generate crud user
# If you change the model later
nugra regenerate crud user
```

### Development & Build
```bash
nugra run dev
nugra run build
```
Run development servers for frontend and backend, or build both for production.

### Install Packages
```bash
nugra install <package>
nugra i <package>
```
Install npm package in project root. Use `--frontend` or `--backend` to install in frontend/backend folder:
```bash
nugra install axios --frontend
nugra install @nestjs/config --backend
```

### Database Migration
```bash
nugra migration:create <migration-name>
nugra migration:run
```
Create and run database migrations.

### Utility
```bash
nugra help
nugra version
```
Show CLI help and version information.

---

## Usage Example

1. Initialize a new project:
   ```bash
   npx create-nugrajs-app my-app
   cd my-app
   nugra create my-app
   ```

2. Generate a new module:
   ```bash
   nugra generate entity product --fields "name:string,price:number"
   ```

3. Create and run migrations:
   ```bash
   nugra migration:create add-products-table
   nugra migration:run
   ```

---

## Features

- Monorepo structure: **apps/frontend**, **apps/backend**, **packages/ui**, **App/models**
- Backend: **NestJS** + **TypeORM** + **Swagger** + **JWT**
- Frontend: **React** + **Vite** + **API Proxy**
- Automatic CRUD generation from models in `App/models`
- Regeneration workflow: update model, regenerate code
- Foreign key relations detected automatically from model references
- All id fields use UUID and are auto-generated on insert
- Database migration system
- CORS, JWT, .env configuration
- Proxy API and Swagger documentation

---

## API Documentation

Swagger is available at:
```
/api-docs
```
on the backend server.
