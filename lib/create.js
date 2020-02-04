const Fs = require("fs");
const Chalk = require("chalk");
const Inquirer = require("inquirer");
const Ora = require("ora");

const { CREATE_TEXT } = require("../i18n");
const { AbsPath, IsExist, ReadFile } = require("../util/setting");

module.exports = async function() {
	const question = [{
		default: "demo",
		message: CREATE_TEXT.qaName,
		name: "NAME",
		type: "input",
		validate(val) {
			const regexp = /^[0-9a-z][0-9a-z_-\.]*$/g;
			if (!regexp.test(val)) {
				return Chalk.redBright(CREATE_TEXT.judgeName);
			} else if (IsExist(val)) {
				return Chalk.redBright(CREATE_TEXT.judgeExist);
			} else {
				return true;
			}
		}
	}, {
		message: CREATE_TEXT.qaDesc,
		name: "DESC",
		type: "input"
	}, {
		message: CREATE_TEXT.qaKeyword,
		name: "KEYWORD",
		type: "input",
		validate(val) {
			const regexp = /^[0-9A-Za-z\s\u4e00-\u9fa5]*$/g;
			return !val || regexp.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeKeyword);
		}
	}, {
		message: CREATE_TEXT.qaLink,
		name: "HOMEPAGE",
		type: "input",
		validate(val) {
			const regexp = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[0-9A-Za-z][0-9A-Za-z-]{0,62}(\.[0-9A-Za-z][0-9A-Za-z-]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/;
			return !val || regexp.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeLink);
		}
	}, {
		message: CREATE_TEXT.qaAuthor,
		name: "AUTHOR",
		type: "input",
		validate(val) {
			const regexp = /^[\w\s-\u4e00-\u9fa5]*$/g;
			return val && regexp.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeAuthor);
		}
	}];
	const { AUTHOR, DESC, HOMEPAGE, KEYWORD, NAME } = await Inquirer.prompt(question);
	const spinner = Ora(CREATE_TEXT.generating);
	spinner.start();
	Fs.mkdirSync(AbsPath(NAME));
	const packageJson = {
		/* eslint-disable sort-keys */
		name: NAME,
		version: "0.0.1",
		description: DESC.trim().replace(/\\/g, "\\\\").replace(/"/g, "\\\""),
		keywords: KEYWORD.trim().split(" ").filter(Boolean),
		author: AUTHOR.trim(),
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
	const assetsDP = ReadFile("../temp", 1);
	const packageDP = AbsPath(`${NAME}/package.json`);
	for (const v of assetsDP) {
		const sp = AbsPath(`../temp/${v}`, 1);
		const dp = AbsPath(`${NAME}/${v}`);
		let content = Fs.readFileSync(sp, "utf8");
		if (v === "license") {
			content = content
				.replace(/#author#/g, AUTHOR.trim())
				.replace(/#year#/g, new Date().getFullYear());
		}
		Fs.writeFileSync(dp, content, "utf8");
	}
	Fs.writeFileSync(
		packageDP,
		JSON.stringify(packageJson, null, "\t"),
		"utf8"
	);
	spinner.stop();
	console.log(Chalk.greenBright(CREATE_TEXT.created));
};