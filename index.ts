import { watch } from "chokidar";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const runCommand = (command: string) => {
  try {
    execSync(command);
  } catch (e) {
    console.error((e as any).stderr.toString());
  }
};

watch("**/*.ts", { ignored: "index.ts" }).on("change", (path) => {
  runCommand("tsc");
  const js = path.substr(0, path.lastIndexOf(".")) + ".js";
  const data = readFileSync(js, "utf-8");
  writeFileSync(
    js,
    `
    exports = module.exports
    ${data}
  `
  );
  runCommand(`jscad ${js}`);
});
