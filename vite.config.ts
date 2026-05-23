import { defineConfig } from "vite";
import { transformSync } from "@babel/core";
import presetEnv from "@babel/preset-env";

function es3Transform(code: string): string {
  const result = transformSync(code, {
    presets: [[presetEnv, { targets: { ie: "6" }, modules: false }]],
    plugins: [
      ["@babel/plugin-transform-for-of", { assumeArray: true }],
      ["@babel/plugin-transform-destructuring", { loose: true }],
      ["@babel/plugin-transform-spread", { loose: true }],
    ],
    configFile: false,
    babelrc: false,
  });
  return result!.code!;
}

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["iife"],
      name: "ruby",
      fileName: () => "ruby.jsx",
    },
    target: "es2015",
    outDir: "dist",
    minify: false,
    rollupOptions: {
      output: {
        strict: false,
      },
    },
  },
  plugins: [
    {
      name: "es3-transform",
      generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === "chunk") {
            chunk.code = es3Transform(chunk.code);
          }
        }
      },
    },
  ],
});
