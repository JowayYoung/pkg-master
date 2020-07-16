
const Inquirer = require("inquirer");

const {
	QT_CREATE_AUTHOR,
	QT_CREATE_DESC,
	QT_CREATE_HOME,
	QT_CREATE_KEYWORD,
	QT_CREATE_NAME
} = require("./question");

async function CreateAnswer() {
	const question = [
		QT_CREATE_NAME,
		QT_CREATE_DESC,
		QT_CREATE_KEYWORD,
		QT_CREATE_HOME,
		QT_CREATE_AUTHOR
	];
	const answer = await Inquirer.prompt(question);
	return answer;
}

module.exports = {
	CreateAnswer
};