import fs from "fs";
import { resolve } from "path";

// plugin to remove dev icons from prod build
export function stripDevIcons(isDev: any) {
  if (isDev) return null;

  return {
    name: "strip-dev-icons",
    resolveId(source: string) {
      return source === "virtual-module" ? source : null;
    },
    renderStart(outputOptions: any, _inputOptions: any) {
      const outDir = outputOptions.dir;
      fs.rm(resolve(outDir, "dev-icon-32.png"), () =>
        console.log(`Deleted dev-icon-32.png from prod build`),
      );
      fs.rm(resolve(outDir, "dev-icon-128.png"), () =>
        console.log(`Deleted dev-icon-128.png from prod build`),
      );
    },
  };
}
