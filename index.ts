import { watch } from "chokidar";
import { exec } from "child_process";
import { promisify } from "util";

const runCommand = async (command: string) => {
  try {
    await promisify(exec)(command);
  } catch (e) {
    console.error((e as any).stderr.toString());
  }
};

watch("**/*.ts", { ignored: "index.ts" }).on("change", async (path) => {
  await runCommand("tsc");
  const js = path.substr(0, path.lastIndexOf(".")) + ".js";
  const json = path.substr(0, path.lastIndexOf(".")) + ".jscad.json";
  const stl = path.substr(0, path.lastIndexOf(".")) + ".stl";
  await runCommand(`jscad ${js} -o ${json}`);
  runCommand(`jscad ${json} -o ${stl}`);
});
