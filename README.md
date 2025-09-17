

# NugraJS

NugraJS is a fullstack monorepo framework based on TypeScript, designed to accelerate modern web application development. It integrates a **NestJS** backend (TypeORM, Swagger, JWT) and frontend (**React**, **Vue**, or **Angular**) with a powerful CLI for automating module generation, database migration, and project configuration. NugraJS supports monorepo architecture, API proxying, Swagger documentation, and automatic CORS and JWT management.

This framework is developed by **Panca Nugraha**.

![Fullstack](https://img.shields.io/badge/-Fullstack-blue) 
![Monorepo](https://img.shields.io/badge/-Monorepo-blue) 
![TypeScript](https://img.shields.io/badge/-TypeScript-blue) 
![React](https://img.shields.io/badge/-React-blue) 
![NestJS](https://img.shields.io/badge/-NestJS-blue) 
![Turborepo](https://img.shields.io/badge/-Turborepo-blue)

---

## Installation

```bash
npx create-nugrajs-app <project-name>
```

---

## CLI Commands


### Project Initialization
```bash
nugra create <project-name>
```
Interactive project setup. Choose frontend framework (**React**, **Vue**, **Angular**).

### Module Generation
```bash
nugra generate entity <name> --fields <fields>
```
Generate backend CRUD (NestJS) and frontend components (React/Vue/Angular).

**Example:**
```bash
nugra generate entity user --fields "name:string,email:string"
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

- Monorepo structure: **apps/frontend**, **apps/backend**, **packages/ui**, **packages/models**
- Backend: **NestJS** + **TypeORM** + **Swagger** + **JWT**
- Frontend: **React** + **Vite** + **API Proxy**
- Automatic CRUD generation
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
