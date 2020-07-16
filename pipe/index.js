
const Listr = require("listr");
const Inquirer = require("inquirer");
const { AsyncTo } = require("trample/node.es5");

const {
	QT_CREATE_AUTHOR,
	QT_CREATE_DESC,
	QT_CREATE_HOME,
	QT_CREATE_KEYWORD,
	QT_CREATE_NAME,
	QT_PUBLISH_TASK_AUTH,
	QT_PUBLISH_TASK_ENV,
	QT_PUBLISH_TASK_NPM,
	QT_PUBLISH_TASK_PUBL,
	QT_PUBLISH_TASK_YARN
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

async function PublishAnswer() {
	const tasks = new Listr([
		QT_PUBLISH_TASK_ENV,
		QT_PUBLISH_TASK_YARN,
		QT_PUBLISH_TASK_NPM,
		QT_PUBLISH_TASK_AUTH,
		QT_PUBLISH_TASK_PUBL
	]);
	const result = await AsyncTo(tasks.run());
	return result;
}

module.exports = {
	CreateAnswer,
	PublishAnswer
};