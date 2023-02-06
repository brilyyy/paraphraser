import { execa } from "execa";
import { renameSync, copyFileSync } from "fs";

let extension = "";
if (process.platform === "win32") {
  extension = ".exe";
}

async function main() {
  const rustInfo = (await execa("rustc", ["-vV"])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
  if (!targetTriple) {
    console.error("Failed to determine platform target triple");
  }
  copyFileSync(
    `src-tauri/bin/python/main${extension}`,
    `src-tauri/bin/python/main-${targetTriple}${extension}`
  );

  console.log(`File renamed : main-${targetTriple}${extension}`);
}

main().catch((e) => {
  throw e;
});
