const Fs = require("fs");
const Path = require("path");

function AbsPath(path, mode) {
	const dir = mode ? __dirname : process.cwd();
	return Path.join(dir, path);
}

function AutoBin(fn, ...rest) {
	const lib = require(`../lib/${fn}`);
	lib(...rest);
}

function FormatPackageJson({ author, desc, home, keyword, name }) {
	return {
		/* eslint-disable sort-keys */
		name,
		version: "0.0.1",
		description: desc.trim().replace(/\\/g, "\\\\").replace(/"/g, "\\\""),
		keywords: keyword.trim().split(" ").filter(Boolean),
		author: author.trim(),
		homepage: home,
		repository: { type: "git", url: home },
		license: "MIT",
		main: "index.js",
		scripts: {
			start: "node index.js"
		},
		dependencies: {},
		devDependencies: {},
		engines: {
			node: ">= 10.0.0",
			npm: ">= 5.6.0"
		}
		/* eslint-enable */
	};
}

function IsExist(path, mode) {
	return Fs.existsSync(AbsPath(path, mode));
}

function ReadFile(path, mode) {
	const dir = AbsPath(path, mode);
	return Fs.existsSync(dir)
		? Fs.readdirSync(dir).filter(v => Fs.statSync(`${dir}/${v}`).isFile())
		: [];
}

module.exports = {
	AbsPath,
	AutoBin,
	FormatPackageJson,
	IsExist,
	ReadFile
};