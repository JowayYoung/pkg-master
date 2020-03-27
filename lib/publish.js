const Chalk = require("chalk");
const Execa = require("execa");
const Listr = require("listr");
const TN = require("trample/node.es5");

const { PUBLISH_TEXT } = require("../i18n");
const { AbsPath, IsExist } = require("../util/setting");

module.exports = async function() {
	const envTask = {
		task: () => new Listr([{
			task: () => new Promise(async(resolve, reject) => {
				await TN.WaitFor();
				const [err, res] = await TN.AsyncTo(Execa("node", ["-v"]));
				!err && res ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorNode));
			}),
			title: PUBLISH_TEXT.taskNode
		}, {
			task: () => new Promise(async(resolve, reject) => {
				await TN.WaitFor();
				const [err, res] = await TN.AsyncTo(Execa("npm", ["-v"]));
				!err && res ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorNpm));
			}),
			title: PUBLISH_TEXT.taskNpm
		}, {
			task: async() => new Promise(async(resolve, reject) => {
				await TN.WaitFor();
				const [err, res] = await TN.AsyncTo(Execa("npm", ["config", "get", "registry"]));
				!err && (res.stdout || "").includes("registry.npmjs.org")
					? resolve(true)
					: reject(new Error(PUBLISH_TEXT.errorRegistry));
			}),
			title: PUBLISH_TEXT.taskRegistry
		}]),
		title: PUBLISH_TEXT.taskEnv
	};
	const yarnModule = {
		task: async(ctx, t) => {
			if (IsExist("node_modules")) return;
			const [err, res] = await TN.AsyncTo(Execa("yarn"));
			if (err || !res) {
				ctx.yarn = false;
				t.skip(PUBLISH_TEXT.errorYarnInstall);
			}
		},
		title: PUBLISH_TEXT.taskYarnInstall
	};
	const npmModule = {
		enabled: ctx => ctx.yarn === false,
		task: async() => {
			if (IsExist("node_modules")) return;
			const [err, res] = await TN.AsyncTo(Execa("npm", ["i"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorNpmInstall);
			}
		},
		title: PUBLISH_TEXT.taskNpmInstall
	};
	const npmAuth = {
		task: async() => {
			const [err, res] = await TN.AsyncTo(Execa("npm", ["whoami"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorAuth);
			}
		},
		title: PUBLISH_TEXT.taskAuth
	};
	const npmPublish = {
		task: async() => {
			const [err, res] = await TN.AsyncTo(Execa("npm", ["publish"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorPublish);
			}
		},
		title: PUBLISH_TEXT.taskPublish
	};
	const tasks = new Listr([envTask, yarnModule, npmModule, npmAuth, npmPublish]);
	const [err, res] = await TN.AsyncTo(tasks.run());
	if (err || !res) {
		console.log(Chalk.redBright(PUBLISH_TEXT.publishFail));
	} else {
		const { name, version } = require(AbsPath("package.json"));
		console.log(Chalk.greenBright(PUBLISH_TEXT.publishSucceed(name, version)));
		console.log(Chalk.yellowBright(PUBLISH_TEXT.publishWarning));
	}
};