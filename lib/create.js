const Fs = require("fs");
const Chalk = require("chalk");
const Ora = require("ora");

const { CREATE_TEXT } = require("../i18n");
const { CreateAnswer } = require("../pipe");
const { AbsPath, FormatPackageJson, ReadFile } = require("../util/setting");
const { CreateDir } = require("trample/node");

module.exports = async function() {
	const answer = await CreateAnswer();
	const { author, name } = answer;
	const spinner = Ora(CREATE_TEXT.generating).start();
	CreateDir(AbsPath(name));
	const json = FormatPackageJson(answer);
	const assetsSP = ReadFile("../temp", 1);
	const packageDP = AbsPath(`${name}/package.json`);
	for (const v of assetsSP) {
		const sp = AbsPath(`../temp/${v}`, 1);
		const dp = AbsPath(`${name}/${v}`);
		let content = Fs.readFileSync(sp, "utf8");
		if (v === "license") {
			content = content
				.replace(/#author#/g, author.trim())
				.replace(/#year#/g, new Date().getFullYear());
		}
		Fs.writeFileSync(dp, content, "utf8");
	}
	Fs.writeFileSync(
		packageDP,
		JSON.stringify(json, null, "\t"),
		"utf8"
	);
	spinner.stop();
	console.log(Chalk.greenBright(CREATE_TEXT.created));
};