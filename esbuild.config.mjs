import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import copy from "esbuild-plugin-copy";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const TEST_VAULT = "test-vault/.obsidian/plugins/obsidian-story-graph";

esbuild
	.build({
		banner: {
			js: banner,
		},
		entryPoints: ["src/main.ts"],
		bundle: true,
		external: ["obsidian", "electron", ...builtins],
		format: "cjs",
		watch: !prod,
		target: "es2016",
		logLevel: "info",
		sourcemap: prod ? false : "inline",
		treeShaking: true,
		outfile: TEST_VAULT + "/main.js",
		plugins: [
			copy.default({
				assets: prod
					? {
							from: ["manifest.json", "styles.css"],
							to: ["."],
					  }
					: {
							from: ["manifest.json", "styles.css", ".hotreload"],
							to: ["."],
					  },
			}),
		],
	})
	.catch(() => process.exit(1));
