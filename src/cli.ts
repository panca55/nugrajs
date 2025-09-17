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

    const templatesDir = path.join(__dirname, "templates/entity");
    const outputDirBackend = path.join(process.cwd(), "apps/backend/src/modules", name);
    const outputDirFrontend = path.join(process.cwd(), "apps/frontend/src/modules", name);

    fs.mkdirSync(outputDirBackend, { recursive: true });
    fs.mkdirSync(outputDirFrontend, { recursive: true });

    const files = [
      "model.ts.ejs",
      "service.ts.ejs",
      "controller.ts.ejs",
      "module.ts.ejs",
      "list.tsx.ejs",
      "form.tsx.ejs",
      "detail.tsx.ejs"
    ];

    files.forEach(file => {
      const templatePath = path.join(templatesDir, file);
      const outputFile = path.join(
        file.endsWith(".tsx.ejs") ? outputDirFrontend : outputDirBackend,
        file.replace(".ejs", "")
          .replace("model", `${name}.model`)
          .replace("service", `${name}.service`)
          .replace("controller", `${name}.controller`)
          .replace("module", `${name}.module`)
          .replace("list", `${capitalize(name)}List`)
          .replace("form", `${capitalize(name)}Form`)
          .replace("detail", `${capitalize(name)}Detail`)
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