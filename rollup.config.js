import { swc, defineRollupSwcOption } from "rollup-plugin-swc3";
import dts from "rollup-plugin-dts";
import { fileURLToPath, URL } from "node:url";

const bundle = (config) => ({
  external: (id) => {
    return id === "./index.mjs" || !/^[./]/.test(id);
  },
  ...config,
});

const swcPlugin = swc(
  defineRollupSwcOption({
    jsc: {
      baseUrl: fileURLToPath(new URL(".", import.meta.url)),
      target: "es2021",
      parser: {
        syntax: "typescript",
      },
    },
  }),
);

export default [
  bundle({
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es",
    },
    plugins: [swcPlugin],
  }),
  bundle({
    input: "src/index.cjs.ts",
    output: {
      file: "dist/index.cjs",
      format: "es",
    },
    plugins: [swcPlugin],
  }),
  bundle({
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
  }),
];
