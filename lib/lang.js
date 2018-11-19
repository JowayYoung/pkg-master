const Fs = require("fs");
const Util = require("util");
const Chalk = require("chalk");
const Inquirer = require("inquirer");

const { AbsPath } = require("./index");
const { LANG_TEXT } = require("../i18n");

module.exports = async function Lang() {
	const question = [{
		choices: ["zh 中文", "en English"],
		default: 0,
		message: LANG_TEXT.qaLanguage,
		name: "language",
		type: "list"
	}];
	const answer = await Inquirer.prompt(question);
	const language = answer.language.split(" ")[0];
	const readFile = Util.promisify(Fs.readFile);
	const writeFile = Util.promisify(Fs.writeFile);
	const langPath = AbsPath("../i18n/index.js", 1);
	const langContent = await readFile(langPath, "utf8");
	const line = langContent.split(";");
	for (let i = 0; i < line.length; i++) {
		if (line[i].includes("require")) {
			line[i] = `const I18n = require("./${language}")`;
			break;
		}
	}
	const langResult = line.join(";");
	await writeFile(langPath, langResult);
	console.log(Chalk.greenBright(LANG_TEXT.langSucceed));
};