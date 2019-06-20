const Fs = require("fs");
const Util = require("util");
const Chalk = require("chalk");
const Inquirer = require("inquirer");
const Ora = require("ora");

const { NEW_TEXT } = require("../i18n");
const { AbsPath, IsExist, ReadFile, TrimSpace } = require("../util/setting");

module.exports = async function() {
	const question = [{
		default: "demo",
		message: NEW_TEXT.qaName,
		name: "NAME",
		type: "input",
		validate(val) {
			const regexp = /^[0-9a-z][0-9a-z-_]*$/ig;
			if (!regexp.test(val)) {
				return Chalk.redBright(NEW_TEXT.judgeName);
			} else if (IsExist(val)) {
				return Chalk.redBright(NEW_TEXT.judgeExist);
			} else {
				return true;
			}
		}
	}, {
		message: NEW_TEXT.qaDesc,
		name: "DESC",
		type: "input"
	}, {
		message: NEW_TEXT.qaKeyword,
		name: "KEYWORD",
		type: "input",
		validate(val) {
			const regexp = /^[0-9a-z\u4e00-\u9fa5 ]*$/ig;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgeKeyword);
		}
	}, {
		message: NEW_TEXT.qaLink,
		name: "HOMEPAGE",
		type: "input",
		validate(val) {
			const regexp = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[0-9A-Za-z][0-9A-Za-z-]{0,62}(\.[0-9A-Za-z][0-9A-Za-z-]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgeLink);
		}
	}, {
		message: NEW_TEXT.qaAuthor,
		name: "AUTHOR",
		type: "input",
		validate(val) {
			const regexp = /^[0-9a-z\u4e00-\u9fa5-_ ]*$/ig;
			if (!val) {
				return Chalk.redBright(NEW_TEXT.judgeAuthorEmpty);
			} else if (!regexp.test(val)) {
				return Chalk.redBright(NEW_TEXT.judgeAuthorEmpty);
			} else {
				return true;
			}
		}
	}];
	const { AUTHOR, DESC, HOMEPAGE, KEYWORD, NAME } = await Inquirer.prompt(question);
	const mkdir = Util.promisify(Fs.mkdir);
	const readFile = Util.promisify(Fs.readFile);
	const writeFile = Util.promisify(Fs.writeFile);
	const spinner = Ora(NEW_TEXT.generating);
	spinner.start();
	await mkdir(AbsPath(NAME));
	const packageJson = {
		/* eslint-disable sort-keys */
		name: NAME,
		version: "1.0.0",
		description: TrimSpace(DESC.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")),
		keywords: TrimSpace(KEYWORD).split(" ").filter(Boolean),
		author: TrimSpace(AUTHOR),
		homepage: HOMEPAGE,
		license: "MIT",
		main: "index.js",
		scripts: {
			start: "node index.js"
		},
		dependencies: {},
		devDependencies: {},
		engines: {
			node: ">= 8.0.0",
			npm: ">= 5.0.0"
		}
		/* eslint-enable */
	};
	const packageDP = AbsPath(`${NAME}/package.json`);
	await writeFile(packageDP, JSON.stringify(packageJson, null, "\t"), "utf8");
	for (let v of ReadFile("../temp", 1)) {
		const sp = AbsPath(`../temp/${v}`, 1);
		const dp = AbsPath(`${NAME}/${v}`);
		let content = await readFile(sp, "utf8");
		if (v === "license") {
			content = content
				.replace(/#author#/g, TrimSpace(AUTHOR))
				.replace(/#year#/g, new Date().getFullYear());
		}
		await writeFile(dp, content, "utf8");
	}
	spinner.stop();
	console.log(Chalk.greenBright(NEW_TEXT.newed));
};