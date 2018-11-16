const Fs = require("fs");
const Util = require("util");
const Chalk = require("chalk");
const Figures = require("figures");
const Inquirer = require("inquirer");

const { AbsPath, ReadFile, ReadFolder } = require("./index");

module.exports = async function() {
	const question = [{
		default: "demo",
		message: "请输入名称",
		name: "name",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z-_]*$/g;
			if (!regexp.test(val)) {
				return Chalk.redBright("名称只能由数字、小写字母、中划线、下划线组成");
			} else if (ReadFolder("").includes(val)) {
				return Chalk.redBright("模块已存在，请使用其他名称创建模块");
			} else {
				return true;
			}
		}
	}, {
		message: "请输入描述",
		name: "desc",
		type: "input"
	}, {
		message: "请输入关键字",
		name: "keyword",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z\u4e00-\u9fa5 ]*$/ig;
			if (!regexp.test(val)) {
				return Chalk.redBright("关键字只能由数字、字母和中文组成，并且使用空格隔开");
			} else {
				return true;
			}
		}
	}, {
		message: "请输入链接",
		name: "homepage",
		type: "input",
		validate: val => {
			const regexp = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[0-9A-Za-z][0-9A-Za-z-]{0,62}(\.[0-9A-Za-z][0-9A-Za-z-]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/;
			if (!val) {
				return true;
			} else if (!regexp.test(val)) {
				return Chalk.redBright("请输入正确的链接");
			} else {
				return true;
			}
		}
	}, {
		message: "请输入作者",
		name: "author",
		type: "input",
		validate: val => {
			const regexp = /^[0-9a-z\u4e00-\u9fa5-_ ]*$/ig;
			if (!val) {
				return Chalk.redBright("作者名称不能为空");
			} else if (!regexp.test(val)) {
				return Chalk.redBright("名称只能由数字、字母、中文、中划线、下划线组成");
			} else {
				return true;
			}
		}
	}, {
		message: "请输入电话",
		name: "phone",
		type: "input",
		validate: val => {
			const regexp = /^1[3-9]\d{9}$|^([5|6|8|9])\d{7}$|^6([6|8])\d{5}$|^09\d{8}$/;
			if (!val) {
				return true;
			} else if (!regexp.test(val)) {
				return Chalk.redBright("请输入正确的电话");
			} else {
				return true;
			}
		}
	}, {
		message: "请输入邮箱",
		name: "email",
		type: "input",
		validate: val => {
			const regexp = /^([0-9A-Za-z-_.])+@([0-9A-Za-z])+.([0-9a-z]{2,4})$/;
			if (!val) {
				return true;
			} else if (!regexp.test(val)) {
				return Chalk.redBright("请输入正确的邮箱");
			} else {
				return true;
			}
		}
	}];
	const answer = await Inquirer.prompt(question);
	// 生成文件
	const readFile = Util.promisify(Fs.readFile);
	const writeFile = Util.promisify(Fs.writeFile);
	const mkdir = Util.promisify(Fs.mkdir);
	const { author, desc, email, homepage, keyword, name, phone } = answer;
	await mkdir(AbsPath(name));
	for (let v of ReadFile("../template", 1)) {
		const srcPath = AbsPath(`../template/${v}`, 1);
		const distPath = AbsPath(`${name}/${v}`);
		let content = await readFile(srcPath, "utf8");
		if (v === "LICENSE" || v === "package.json") {
			content = content
				.replace(/#author#/g, author.replace(/(^\s*)|(\s*$)/g, ""))
				.replace(/#desc#/g, desc)
				.replace(/#email#/g, email)
				.replace(/#homepage#/g, homepage)
				.replace(/#keyword#/g, JSON.stringify(keyword.split(" ")))
				.replace(/#name#/g, name)
				.replace(/#phone#/g, phone)
				.replace(/#year#/g, new Date().getFullYear());
		}
		await writeFile(distPath, content, "utf8");
	}
	console.log(`${Chalk.yellowBright(Figures.tick)} ${Chalk.greenBright("模块创建成功")}`);
};