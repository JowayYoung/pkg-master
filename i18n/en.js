const Chalk = require("chalk");
const Figures = require("figures");

const ACTION_TEXT = {
	lang: "Switch Language",
	new: "Create Module",
	publish: "Publish Module"
};

const LANG_TEXT = {
	langSucceed: `${Figures.tick} Language was switched successfully`,
	qaLanguage: "Please select international language"
};

const NEW_TEXT = {
	judgeAuthor: `${Figures.cross} Author can only be composed of numbers, letters, Chinese, middle line, and underline`,
	judgeAuthorEmpty: `${Figures.cross} Author can't be empty`,
	judgeEmail: `${Figures.cross} Please input the correct mailbox`,
	judgeExist: `${Figures.cross} Module already exists, please use other name to create module`,
	judgeKeyword: `${Figures.cross} Keyword can only be composed of numbers, letters and Chinese, and use spaces to separate them`,
	judgeLink: `${Figures.cross} Please input the correct link`,
	judgeName: `${Figures.cross} Name can only be composed of numbers, lowercase letters, middle line, and underline`,
	judgePhone: `${Figures.cross} Please input the correct phone`,
	newSucceed: `${Figures.tick} Module was created successfully`,
	qaAuthor: "Please input author",
	qaDesc: "Please input description",
	qaEmail: "Please input email",
	qaKeyword: "Please input keyword",
	qaLink: "Please input link",
	qaName: "Please input name",
	qaPhone: "Please input phone"
};

const PUBLISH_TEXT = {
	errorLogin: `${Figures.cross} Please login to your Npm account`,
	errorNode: `${Figures.cross} Node not installed`,
	errorNpm: `${Figures.cross} Npm is not installed`,
	errorNpmInstall: `${Figures.cross} Dependencies was installed failed, please check ${Chalk.blueBright("package.json")}`,
	errorPublish: `${Figures.cross} Module already exists, please use other name to publish module`,
	errorRegistry: `${Figures.cross} Please execute ${Chalk.blueBright("npm config set registry https://registry.npmjs.org/")} to switch back to source registry`,
	errorYarnInstall: `${Figures.cross} Please execute ${Chalk.blueBright("npm i -g yarn")} installed ${Chalk.blueBright("yarn")}`,
	publishFail: `${Figures.cross} Error in execution steps, please repair and execute ${Chalk.blueBright("pkg-master publish")} or ${Chalk.blueBright("pkg-master p")} according to the prompt`,
	publishSucceed: `${Figures.tick} Module was published successfully`,
	publishWarning: `${Figures.warning} Please execute ${Chalk.blueBright("npm config set registry https://registry.npm.taobao.org/")} to switch back to Taobao registry`,
	taskEnv: "Check Node running environment",
	taskLogin: "View Npm account login status",
	taskNode: "Check whether Node is installed",
	taskNpm: "Check whether Npm is installed",
	taskNpmInstall: "Use Npm to install dependencies",
	taskPublish: "Release Npm module",
	taskRegistry: "Check Npm registry",
	taskYarnInstall: "Use Yarn to install dependencies"
};

module.exports = {
	ACTION_TEXT,
	LANG_TEXT,
	NEW_TEXT,
	PUBLISH_TEXT
};