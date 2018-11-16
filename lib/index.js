const Fs = require("fs");
const Path = require("path");

function AbsPath(path, mode) {
	const dir = mode ? __dirname : process.cwd();
	return Path.join(dir, path);
}

function AsyncTo(promise) {
	return promise.then(data => [null, data]).catch(err => [err]);
}

function ReadFile(path, mode) {
	const dir = AbsPath(path, mode);
	return Fs.existsSync(dir)
		? Fs.readdirSync(dir).filter(v => Fs.statSync(`${dir}/${v}`).isFile())
		: [];
}

function ReadFolder(path, mode) {
	const dir = AbsPath(path, mode);
	return Fs.existsSync(dir)
		? Fs.readdirSync(dir).filter(v => Fs.statSync(`${dir}/${v}`).isDirectory())
		: [];
}

module.exports = {
	AbsPath,
	AsyncTo,
	ReadFile,
	ReadFolder
};