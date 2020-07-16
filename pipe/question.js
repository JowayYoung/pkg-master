const Chalk = require("chalk");

const { CREATE_TEXT } = require("../i18n");
const { CREATE_REGEXP } = require("../util/getting");
const { IsExist } = require("../util/setting");

const QT_CREATE_AUTHOR = {
	message: CREATE_TEXT.qaAuthor,
	name: "author",
	type: "input",
	validate: val => val && CREATE_REGEXP.author.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeAuthor)
};

const QT_CREATE_DESC = {
	message: CREATE_TEXT.qaDesc,
	name: "desc",
	type: "input"
};

const QT_CREATE_HOME = {
	message: CREATE_TEXT.qaHome,
	name: "home",
	type: "input",
	validate: val => !val || CREATE_REGEXP.home.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeHome)
};

const QT_CREATE_KEYWORD = {
	message: CREATE_TEXT.qaKeyword,
	name: "keyword",
	type: "input",
	validate: val => !val || CREATE_REGEXP.keyword.test(val) ? true : Chalk.redBright(CREATE_TEXT.judgeKeyword)
};

const QT_CREATE_NAME = {
	default: "demo",
	message: CREATE_TEXT.qaName,
	name: "name",
	type: "input",
	validate(val) {
		if (!CREATE_REGEXP.name.test(val)) {
			return Chalk.redBright(CREATE_TEXT.judgeName);
		} else if (IsExist(val)) {
			return Chalk.redBright(CREATE_TEXT.judgeExist);
		} else {
			return true;
		}
	}
};

module.exports = {
	QT_CREATE_AUTHOR,
	QT_CREATE_DESC,
	QT_CREATE_HOME,
	QT_CREATE_KEYWORD,
	QT_CREATE_NAME
};