const Chalk = require("chalk");
const Execa = require("execa");
const Listr = require("listr");
const { WaitFor } = require("trample/node.es5");

const { CREATE_TEXT, PUBLISH_TEXT } = require("../i18n");
const { CREATE_REGEXP, PUBLISH_REGEXP } = require("../util/getting");
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

const QT_PUBLISH_TASK_ENV_NODE = {
	task() {
		return new Promise(async(resolve, reject) => {
			try {
				await WaitFor(2000);
				const { stdout } = await Execa("node", ["-v"]);
				PUBLISH_REGEXP.node.test(stdout)
					? resolve(true)
					: reject(new Error(PUBLISH_TEXT.errorEnvNode));
			} catch (err) {
				reject(err);
			}
		});
	},
	title: PUBLISH_TEXT.taskEnvNode
};

const QT_PUBLISH_TASK_ENV_NPM = {
	task() {
		return new Promise(async(resolve, reject) => {
			try {
				await WaitFor(2000);
				const { stdout } = await Execa("npm", ["-v"]);
				PUBLISH_REGEXP.npm.test(stdout)
					? resolve(true)
					: reject(new Error(PUBLISH_TEXT.errorEnvNpm));
			} catch (err) {
				reject(err);
			}
		});
	},
	title: PUBLISH_TEXT.taskEnvNpm
};

const QT_PUBLISH_TASK_ENV_REGISTRY = {
	task() {
		return new Promise(async(resolve, reject) => {
			try {
				await WaitFor(1000);
				const { stdout } = await Execa("npm", ["config", "get", "registry"]);
				PUBLISH_REGEXP.registry.test(stdout)
					? resolve(true)
					: reject(new Error(PUBLISH_TEXT.errorEnvRegistry));
			} catch (err) {
				reject(err);
			}
		});
	},
	title: PUBLISH_TEXT.taskEnvRegistry
};

const QT_PUBLISH_TASK_AUTH = {
	async task() {
		return new Promise(async(resolve, reject) => {
			try {
				const { stdout } = await Execa("npm", ["whoami"]);
				stdout ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorAuth));
			} catch (err) {
				reject(new Error(PUBLISH_TEXT.errorAuth));
			}
		});
	},
	title: PUBLISH_TEXT.taskAuth
};

const QT_PUBLISH_TASK_ENV = {
	task: () => new Listr([
		QT_PUBLISH_TASK_ENV_NODE,
		QT_PUBLISH_TASK_ENV_NPM,
		QT_PUBLISH_TASK_ENV_REGISTRY
	]),
	title: PUBLISH_TEXT.taskEnv
};

const QT_PUBLISH_TASK_NPM = {
	enabled: ctx => ctx.yarn === false,
	async task() {
		return new Promise(async(resolve, reject) => {
			try {
				if (IsExist("node_modules")) return;
				await Execa("npm", ["i"]);
				resolve(true);
			} catch (err) {
				reject(PUBLISH_TEXT.errorNpm);
			}
		});
	},
	title: PUBLISH_TEXT.taskNpm
};

const QT_PUBLISH_TASK_PUBL = {
	async task() {
		return new Promise(async(resolve, reject) => {
			try {
				const { stdout } = await Execa("npm", ["publish"]);
				stdout ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorPublish));
			} catch (err) {
				reject(new Error(PUBLISH_TEXT.errorPublish));
			}
		});
	},
	title: PUBLISH_TEXT.taskPublish
};

const QT_PUBLISH_TASK_YARN = {
	async task(ctx, t) {
		try {
			if (IsExist("node_modules")) return;
			await Execa("yarn");
			ctx.yarn = true;
		} catch (err) {
			ctx.yarn = false;
			t.skip(PUBLISH_TEXT.errorYarn);
		}
	},
	title: PUBLISH_TEXT.taskYarn
};

module.exports = {
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
};