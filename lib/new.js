const Fs = require("fs");
const Util = require("util");
const Chalk = require("chalk");
const Inquirer = require("inquirer");
const LatestVersion = require("latest-version");
const Ora = require("ora");

const { AbsPath, EscapeStr, ReadFile, ReadFolder, TrimSpace } = require("./index");
const { NEW_TEXT } = require("../i18n");

module.exports = async function() {
	const dependence = [
		"eslint",
		"eslint-config-standard",
		"eslint-plugin-import",
		"eslint-plugin-node",
		"eslint-plugin-promise",
		"eslint-plugin-standard",
		"rimraf"
	];
	const question = [{
		default: "demo",
		message: NEW_TEXT.qaName,
		name: "name",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z-_]*$/g;
			if (!regexp.test(val)) {
				return Chalk.redBright(NEW_TEXT.judgeName);
			} else if (ReadFolder("").includes(val)) {
				return Chalk.redBright(NEW_TEXT.judgeExist);
			} else {
				return true;
			}
		}
	}, {
		message: NEW_TEXT.qaDesc,
		name: "desc",
		type: "input"
	}, {
		message: NEW_TEXT.qaKeyword,
		name: "keyword",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z\u4e00-\u9fa5 ]*$/ig;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgeKeyword);
		}
	}, {
		message: NEW_TEXT.qaLink,
		name: "homepage",
		type: "input",
		validate: val => {
			const regexp = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[0-9A-Za-z][0-9A-Za-z-]{0,62}(\.[0-9A-Za-z][0-9A-Za-z-]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgeLink);
		}
	}, {
		message: NEW_TEXT.qaAuthor,
		name: "author",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z\u4e00-\u9fa5-_ ]*$/ig;
			if (!val) {
				return Chalk.redBright(NEW_TEXT.judgeAuthorEmpty);
			} else if (!regexp.test(val)) {
				return Chalk.redBright(NEW_TEXT.judgeAuthorEmpty);
			} else {
				return true;
			}
		}
	}, {
		message: NEW_TEXT.qaPhone,
		name: "phone",
		type: "input",
		validate: val => {
			const regexp = /^1[3-9]\d{9}$|^([5|6|8|9])\d{7}$|^6([6|8])\d{5}$|^09\d{8}$/;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgePhone);
		}
	}, {
		message: NEW_TEXT.qaEmail,
		name: "email",
		type: "input",
		validate: val => {
			const regexp = /^([0-9A-Za-z-_.])+@([0-9A-Za-z])+.([0-9a-z]{2,4})$/;
			return !val || regexp.test(val) ? true : Chalk.redBright(NEW_TEXT.judgeEmail);
		}
	}];
	const answer = await Inquirer.prompt(question);
	const { author, desc, email, homepage, keyword, name, phone } = answer;
	const mkdir = Util.promisify(Fs.mkdir);
	const readFile = Util.promisify(Fs.readFile);
	const writeFile = Util.promisify(Fs.writeFile);
	const spinner = Ora(NEW_TEXT.generating);
	const outputDep = async() => dependence.reduce(async(t, v) => {
		const dep = await t;
		const version = await LatestVersion(v);
		dep[v] = version;
		return dep;
	}, Promise.resolve({}));
	spinner.start();
	await mkdir(AbsPath(name));
	const deps = await outputDep();
	for (let v of ReadFile("../template", 1)) {
		const srcPath = AbsPath(`../template/${v}`, 1);
		const distPath = AbsPath(`${name}/${v}`);
		let content = await readFile(srcPath, "utf8");
		if (v === "LICENSE" || v === "package.json") {
			content = content
				.replace(/#author#/g, TrimSpace(author))
				.replace(/#desc#/g, TrimSpace(EscapeStr(desc)))
				.replace(/#deps#/g, JSON.stringify(deps))
				.replace(/#email#/g, email)
				.replace(/#homepage#/g, homepage)
				.replace(/#keyword#/g, JSON.stringify(TrimSpace(keyword).split(" ").filter(v => v)))
				.replace(/#name#/g, name)
				.replace(/#phone#/g, phone)
				.replace(/#year#/g, new Date().getFullYear());
		}
		await writeFile(distPath, content, "utf8");
		if (v === "package.json") {
			const packageJson = require(AbsPath(`${name}/package.json`));
			await writeFile(distPath, JSON.stringify(packageJson, null, 4), "utf8");
		}
	}
	spinner.stop();
	console.log(Chalk.greenBright(NEW_TEXT.newSucceed));
};