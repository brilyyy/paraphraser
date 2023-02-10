import { execa } from "execa";
import { copyFileSync } from "fs";

let extension = "";
if (process.platform === "win32") {
  extension = ".exe";
}

async function cpBinaries(targetTriple) {
  const opsys = process.platform;
  if (opsys == "darwin") {
    if (process.arch.includes("arm")) {
      // cp chrome driver
      copyFileSync(
        "bin/darwin-arm/chromedriver",
        `src-tauri/bin/chromedriver-${targetTriple}`
      );
      console.log(`Driver copied: chromedriver-${targetTriple}`);
    } else {
      copyFileSync(
        "bin/darwin-64/chromedriver",
        `src-tauri/bin/chromedriver-${targetTriple}`
      );
      console.log(`Driver copied: chromedriver-${targetTriple}`);
    }
  } else if (opsys == "win32" || opsys == "win64") {
    copyFileSync(
      "bin/windows/chromedriver.exe",
      `src-tauri/bin/chromedriver-${targetTriple}.exe`
    );
    console.log(`Driver copied: chromedriver-${targetTriple}.exe`);
  } else if (opsys == "linux") {
    copyFileSync(
      "bin/linux/chromedriver",
      `src-tauri/bin/chromedriver-${targetTriple}`
    );
    console.log(`Driver copied: chromedriver-${targetTriple}`);
  }
}

async function main() {
  const rustInfo = (await execa("rustc", ["-vV"])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];
  if (!targetTriple) {
    console.error("Failed to determine platform target triple");
  }
  await cpBinaries(targetTriple);
}

main().catch((e) => {
  throw e;
});
