import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';


const ENTRY_POINTS = ["./src/background.ts", "./src/injected.ts"];
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_WATCH = process.argv[2] === "--watch";
const BUILD_DIR = './build/';
const BUILD_DIR_ABSOLUTE = path.join(process.cwd(), BUILD_DIR);
const STATIC_DIR = './static/';
const STATIC_DIR_ABSOLUTE = path.join(process.cwd(), STATIC_DIR);

// Delete existing build
fs.readdirSync(BUILD_DIR_ABSOLUTE).forEach(filePath => {
  fs.rmSync(
    path.join(BUILD_DIR_ABSOLUTE, filePath),
    {
      recursive: true
    }
  );
})

// Copy static files into build directory
fs.cpSync(
  STATIC_DIR_ABSOLUTE,
  BUILD_DIR_ABSOLUTE,
  {
    recursive: true,
  }
);

const esbuildSettings = {
  bundle: true,
  entryPoints: ENTRY_POINTS,
  minify: IS_PRODUCTION,
  outdir: BUILD_DIR,
  sourcemap: !IS_PRODUCTION,
  target: "chrome58",
};

if (IS_WATCH) {
  // Build ctx to run in watch mode
  const ctx = await esbuild.context(esbuildSettings);
  await ctx.watch();
} else {
  // Run esbuild
  await esbuild.build(esbuildSettings);
}