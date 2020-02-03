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
	IsExist,
	ReadFile
};