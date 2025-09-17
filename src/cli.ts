
import inquirer from "inquirer";
import { Command } from "commander";
import { renderFile } from "ejs";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .command("help")
  .description("Show CLI help information")
  .action(() => {
    program.outputHelp();
  });
program
  .command("install <package>")
  .alias("i")
  .description("Install npm package in project root")
  .option("--frontend", "Install package in apps/frontend")
  .option("--backend", "Install package in apps/backend")
  .action((pkg, options) => {
    const { spawnSync } = require("child_process");
    let targetDir = process.cwd();
    if (options.frontend) {
      targetDir = path.join(process.cwd(), "apps/frontend");
    } else if (options.backend) {
      targetDir = path.join(process.cwd(), "apps/backend");
    }
    console.log(`Installing package '${pkg}' in ${targetDir}`);
    const result = spawnSync("npm", ["install", pkg], { cwd: targetDir, stdio: "inherit", shell: true });
    if (result.error) {
      console.error("Failed to install package:", result.error.message);
    }
  });
program
  .command("run dev")
  .description("Run development server for frontend and backend")
  .action(() => {
    const { spawn } = require("child_process");
    const frontendDir = path.join(process.cwd(), "apps/frontend");
    const backendDir = path.join(process.cwd(), "apps/backend");
    let frontendCmd = "";
    let frontendArgs: string[] = [];
    // Detect frontend framework from package.json
    let frontendType = "React";
    try {
      const pkgPath = path.join(frontendDir, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        if (pkg.dependencies && pkg.dependencies["@angular/core"]) frontendType = "Angular";
        else if (pkg.dependencies && pkg.dependencies["vue"]) frontendType = "Vue";
      }
    } catch {}
    if (frontendType === "Angular") {
      frontendCmd = "npx";
      frontendArgs = ["ng", "serve"];
    } else {
      frontendCmd = "npx";
      frontendArgs = ["vite"];
    }
    // Backend: NestJS
    let backendCmd = "npm";
    let backendArgs = ["run", "start:dev"];
    console.log(`Starting frontend (${frontendType})...`);
    const fe = spawn(frontendCmd, frontendArgs, { cwd: frontendDir, stdio: "inherit", shell: true });
    console.log("Starting backend (NestJS)...");
    const be = spawn(backendCmd, backendArgs, { cwd: backendDir, stdio: "inherit", shell: true });
    fe.on("error", (err: any) => {
      console.error("Failed to start frontend:", err.message);
    });
    be.on("error", (err: any) => {
      console.error("Failed to start backend:", err.message);
    });
  });

program
  .command("run build")
  .description("Build frontend and backend for production")
  .action(() => {
    const { spawnSync } = require("child_process");
    const frontendDir = path.join(process.cwd(), "apps/frontend");
    const backendDir = path.join(process.cwd(), "apps/backend");
    let frontendCmd = "";
    let frontendArgs: string[] = [];
    // Detect frontend framework from package.json
    let frontendType = "React";
    try {
      const pkgPath = path.join(frontendDir, "package.json");
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        if (pkg.dependencies && pkg.dependencies["@angular/core"]) frontendType = "Angular";
        else if (pkg.dependencies && pkg.dependencies["vue"]) frontendType = "Vue";
      }
    } catch {}
    if (frontendType === "Angular") {
      frontendCmd = "npx";
      frontendArgs = ["ng", "build"];
    } else {
      frontendCmd = "npx";
      frontendArgs = ["vite", "build"];
    }
    // Backend: NestJS
    let backendCmd = "npm";
    let backendArgs = ["run", "build"];
    console.log(`Building frontend (${frontendType})...`);
    const fe = spawnSync(frontendCmd, frontendArgs, { cwd: frontendDir, stdio: "inherit", shell: true });
    if (fe.error) {
      console.error("Failed to build frontend:", fe.error.message);
    }
    console.log("Building backend (NestJS)...");
    const be = spawnSync(backendCmd, backendArgs, { cwd: backendDir, stdio: "inherit", shell: true });
    if (be.error) {
      console.error("Failed to build backend:", be.error.message);
    }
  });

program
  .command("version")
  .description("Show NugraJS CLI version")
  .action(() => {
    const pkg = require(path.join(__dirname, "../package.json"));
    console.log(`NugraJS CLI version: ${pkg.version}`);
  });

program
  .command("create <project-name>")
  .description("Initialize a NugraJS project interactively")
  .action(async (projectName: string) => {
  // ...existing code...
    // Ask for frontend framework
    const { frontend } = await inquirer.prompt([
      {
        type: "list",
        name: "frontend",
        message: "Choose frontend framework:",
        choices: ["React", "Vue", "Angular"],
      },
    ]);

    // Create folder structure
    const rootDir = path.join(process.cwd(), projectName);
    const appsDir = path.join(rootDir, "apps");
    const backendDir = path.join(appsDir, "backend");
    const frontendDir = path.join(appsDir, "frontend");
    const packagesDir = path.join(rootDir, "packages");
    const uiDir = path.join(packagesDir, "ui");
    const modelsDir = path.join(packagesDir, "models");

    fs.mkdirSync(backendDir, { recursive: true });
    fs.mkdirSync(frontendDir, { recursive: true });
    fs.mkdirSync(uiDir, { recursive: true });
    fs.mkdirSync(modelsDir, { recursive: true });

  // Copy ESLint & Prettier config to frontend & backend
  const eslintConfigSrc = path.join(__dirname, "templates/.eslintrc.json");
  const prettierConfigSrc = path.join(__dirname, "templates/.prettierrc");
  fs.copySync(eslintConfigSrc, path.join(frontendDir, ".eslintrc.json"));
  fs.copySync(eslintConfigSrc, path.join(backendDir, ".eslintrc.json"));
  fs.copySync(prettierConfigSrc, path.join(frontendDir, ".prettierrc"));
  fs.copySync(prettierConfigSrc, path.join(backendDir, ".prettierrc"));

  // Install ESLint, Prettier, TypeScript plugin dependencies
  const lintDeps = "npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-prettier eslint-config-prettier";
  require("child_process").execSync(lintDeps, { cwd: frontendDir, stdio: "inherit" });
  require("child_process").execSync(lintDeps, { cwd: backendDir, stdio: "inherit" });

    // Copy frontend template files
    let templateSrc = "";
    if (frontend === "React") {
      templateSrc = path.join(__dirname, "templates/react");
    } else if (frontend === "Vue") {
      templateSrc = path.join(__dirname, "templates/vue");
    } else if (frontend === "Angular") {
      templateSrc = path.join(__dirname, "templates/angular");
    }
    if (templateSrc && fs.existsSync(templateSrc)) {
      fs.copySync(templateSrc, frontendDir);
    }

    // Copy Tailwind config files
    fs.copySync(path.join(__dirname, "templates/tailwind.config.js"), path.join(frontendDir, "tailwind.config.js"));
    fs.copySync(path.join(__dirname, "templates/postcss.config.js"), path.join(frontendDir, "postcss.config.js"));
    // Copy index.css/styles.css
    if (frontend === "React") {
      fs.copySync(path.join(__dirname, "templates/react/index.css"), path.join(frontendDir, "index.css"));
    } else if (frontend === "Vue") {
      fs.copySync(path.join(__dirname, "templates/vue/index.css"), path.join(frontendDir, "index.css"));
    } else if (frontend === "Angular") {
      fs.copySync(path.join(__dirname, "templates/angular/styles.css"), path.join(frontendDir, "styles.css"));
    }

    // Install frontend dependencies + TailwindCSS
    let installCmd = "";
    if (frontend === "React") {
      installCmd = `npm install react react-dom vite tailwindcss postcss autoprefixer`;
    } else if (frontend === "Vue") {
      installCmd = `npm install vue vite tailwindcss postcss autoprefixer`;
    } else if (frontend === "Angular") {
      installCmd = `npm install @angular/core @angular/platform-browser @angular/platform-browser-dynamic tailwindcss postcss autoprefixer`;
    }
    if (installCmd) {
      require("child_process").execSync(installCmd, { cwd: frontendDir, stdio: "inherit" });
    }

    // Create README
    fs.writeFileSync(path.join(rootDir, "README.md"), `# ${projectName}\n\nFrontend: ${frontend}\nBackend: NestJS`);

    console.log(`✅ NugraJS monorepo structure for '${projectName}' created!`);
    console.log(`- apps/frontend (${frontend})`);
    console.log("- apps/backend (NestJS)");
    console.log("- packages/ui");
    console.log("- packages/models");
  });

program
  .command("generate entity <name>")
  .option("--fields <fields>", "Fields in format name:type,...")
  .action((name, options) => {
    const fields = options.fields
      ? options.fields.split(",").map((f: string) => {
          const [fname, ftype] = f.split(":");
          return { name: fname, type: ftype };
        })
      : [];


    // Detect frontend type from README
    let frontendType = "React";
    try {
      const readmePath = path.join(process.cwd(), "README.md");
      if (fs.existsSync(readmePath)) {
        const readmeContent = fs.readFileSync(readmePath, "utf8");
        if (readmeContent.includes("Frontend: Vue")) frontendType = "Vue";
        else if (readmeContent.includes("Frontend: Angular")) frontendType = "Angular";
      }
    } catch {}

    const templatesDir = path.join(__dirname, "templates/entity");
    const outputDirBackend = path.join(process.cwd(), "apps/backend/src/modules", name);
    const outputDirFrontend = path.join(process.cwd(), "apps/frontend/src/modules", name);

    fs.mkdirSync(outputDirBackend, { recursive: true });
    fs.mkdirSync(outputDirFrontend, { recursive: true });

    // Select frontend entity templates
    let frontendFiles: string[] = [];
    let frontendTemplateDir = "";
    if (frontendType === "React") {
      frontendFiles = ["list.tsx.ejs", "form.tsx.ejs", "detail.tsx.ejs"];
      frontendTemplateDir = templatesDir;
    } else if (frontendType === "Vue") {
      frontendFiles = ["entity-list.vue.ejs", "entity-form.vue.ejs", "entity-detail.vue.ejs"];
      frontendTemplateDir = path.join(__dirname, "templates/vue");
    } else if (frontendType === "Angular") {
      frontendFiles = ["entity-list.component.ts.ejs", "entity-form.component.ts.ejs", "entity-detail.component.ts.ejs"];
      frontendTemplateDir = path.join(__dirname, "templates/angular");
    }

    const backendFiles = [
      "model.ts.ejs",
      "service.ts.ejs",
      "controller.ts.ejs",
      "module.ts.ejs"
    ];

    // Generate backend files
    backendFiles.forEach(file => {
      const templatePath = path.join(templatesDir, file);
      const outputFile = path.join(
        outputDirBackend,
        file.replace(".ejs", "")
          .replace("model", `${name}.model`)
          .replace("service", `${name}.service`)
          .replace("controller", `${name}.controller`)
          .replace("module", `${name}.module`)
      );
      renderFile(templatePath, { entityName: name, fields }, (err: Error | null, result: string | undefined) => {
        if (err) throw err;
        if (typeof result === "string") {
          fs.writeFileSync(outputFile, result);
          console.log(`✅ Generated ${outputFile}`);
        } else {
          throw new Error("Render file result is undefined");
        }
      });
    });

    // Generate frontend files
    frontendFiles.forEach(file => {
      const templatePath = path.join(frontendTemplateDir, file);
      let outputFile = path.join(outputDirFrontend, file.replace(".ejs", ""));
      if (frontendType === "React") {
        outputFile = path.join(
          outputDirFrontend,
          file.replace(".ejs", "")
            .replace("list", `${capitalize(name)}List`)
            .replace("form", `${capitalize(name)}Form`)
            .replace("detail", `${capitalize(name)}Detail`)
        );
      }
      renderFile(templatePath, { entityName: name, fields }, (err: Error | null, result: string | undefined) => {
        if (err) throw err;
        if (typeof result === "string") {
          fs.writeFileSync(outputFile, result);
          console.log(`✅ Generated ${outputFile}`);
        } else {
          throw new Error("Render file result is undefined");
        }
      });
    });

  // Automatically integrate to AppModule
    const appModulePath = path.join(process.cwd(), "apps/backend/src/app.module.ts");
    let appModuleContent = fs.readFileSync(appModulePath, "utf8");
    const moduleClassName = `${capitalize(name)}Module`;
    const moduleImportPath = `./modules/${name}/${name}.module`;

    // Add import if not exists
    if (!appModuleContent.includes(moduleClassName)) {
      appModuleContent = `import { ${moduleClassName} } from '${moduleImportPath}';\n` + appModuleContent;
    }
    // Add to imports array
    appModuleContent = appModuleContent.replace(/imports:\s*\[([^\]]*)\]/, (match, p1) => {
      if (p1.includes(moduleClassName)) return match;
      return `imports: [${p1 ? p1 + ',' : ''} ${moduleClassName}]`;
    });
    fs.writeFileSync(appModulePath, appModuleContent);
    console.log(`✅ ${moduleClassName} automatically registered in AppModule`);
  });

program.parse(process.argv);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}