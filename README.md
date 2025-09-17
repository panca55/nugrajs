<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NugraJS Documentation</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; color: #222; margin: 0; padding: 0; }
    .container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px; }
    h1 { color: #0070f3; margin-top: 0; }
    h2, h3 { color: #333; margin-top: 32px; }
    pre, code { background: #f3f3f3; border-radius: 4px; padding: 8px; font-size: 1em; }
    ul { margin-left: 24px; }
    .section { margin-bottom: 32px; }
    .badge { display: inline-block; background: #0070f3; color: #fff; border-radius: 4px; padding: 2px 8px; font-size: 0.9em; margin-right: 8px; }
    .command { background: #222; color: #fff; padding: 8px 12px; border-radius: 4px; font-family: 'Fira Mono', monospace; margin: 8px 0; display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NugraJS</h1>
    <p class="section"><span class="badge">Fullstack</span> <span class="badge">Monorepo</span> <span class="badge">TypeScript</span> <span class="badge">React</span> <span class="badge">NestJS</span> <span class="badge">Turborepo</span></p>
    <h2>Installation</h2>
    <pre><code>npx create-nugrajs-app &lt;project-name&gt;</code></pre>

    <h2>CLI Commands</h2>
    <h3>Project Initialization</h3>
    <span class="command">nugra create &lt;project-name&gt;</span>
    <p>Interactive project setup, choose frontend framework (React, Vue, Angular).</p>

    <h3>Module Generation</h3>
    <span class="command">nugra generate entity &lt;name&gt; --fields &lt;fields&gt;</span>
    <p>Generate backend CRUD (NestJS) and frontend components (React/Vue/Angular).<br>
    <b>Example:</b> <code>nugra generate entity user --fields "name:string,email:string"</code></p>

    <h3>Database Migration</h3>
    <span class="command">nugra migration:create &lt;migration-name&gt;</span>
    <span class="command">nugra migration:run</span>
    <p>Create and run database migrations.</p>

    <h3>Utility</h3>
    <span class="command">nugra help</span>
    <span class="command">nugra version</span>
    <p>Show CLI help and version information.</p>

    <h2>Usage Example</h2>
    <ol>
      <li>Initialize a new project:<br>
        <pre><code>npx create-nugrajs-app my-app
cd my-app
nugra create my-app</code></pre>
      </li>
      <li>Generate a new module:<br>
        <pre><code>nugra generate entity product --fields "name:string,price:number"</code></pre>
      </li>
      <li>Create and run migrations:<br>
        <pre><code>nugra migration:create add-products-table
nugra migration:run</code></pre>
      </li>
    </ol>

    <h2>Features</h2>
    <ul>
      <li>Monorepo structure: <b>apps/frontend</b>, <b>apps/backend</b>, <b>packages/ui</b>, <b>packages/models</b></li>
      <li>Backend: <b>NestJS</b> + <b>TypeORM</b> + <b>Swagger</b> + <b>JWT</b></li>
      <li>Frontend: <b>React</b> + <b>Vite</b> + <b>API Proxy</b></li>
      <li>Automatic CRUD generation</li>
      <li>Database migration system</li>
      <li>CORS, JWT, .env configuration</li>
      <li>Proxy API and Swagger documentation</li>
    </ul>

    <h2>API Documentation</h2>
    <p>Swagger is available at <code>/api-docs</code> on the backend server.</p>

    <h2>Publishing</h2>
    <p>Ensure your <code>package.json</code> has the correct <code>bin</code> field and build script.<br>
    Run <code>npm publish</code> to release to NPM.</p>

    <h2>Contribution</h2>
    <p>Pull requests and issues are welcome!</p>
  </div>
</body>
</html>