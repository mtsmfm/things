import { watch } from "chokidar";
import { execSync } from "child_process";

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
  runCommand(`jscad ${js}`);
});
