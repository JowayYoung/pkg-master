const Chalk = require("chalk");
const Execa = require("execa");
const Listr = require("listr");

const { PUBLISH_TEXT } = require("../i18n");
const { AbsPath, AsyncTo, IsExist } = require("../util/setting");

module.exports = async function() {
	const tasks = new Listr([{
		task: () => new Listr([{
			task: () => new Promise(async(resolve, reject) => {
				const res = await Execa.stdout("node", ["-v"]);
				setTimeout(() => res ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorNode)), 2000);
			}),
			title: PUBLISH_TEXT.taskNode
		}, {
			task: () => new Promise(async(resolve, reject) => {
				const res = await Execa.stdout("npm", ["-v"]);
				setTimeout(() => res ? resolve(true) : reject(new Error(PUBLISH_TEXT.errorNpm)), 2000);
			}),
			title: PUBLISH_TEXT.taskNpm
		}, {
			task: async() => new Promise(async(resolve, reject) => {
				const res = await Execa.stdout("npm", ["config", "get", "registry"]);
				setTimeout(
					() => res === "https://registry.npmjs.org/"
						? resolve(true)
						: reject(new Error(PUBLISH_TEXT.errorRegistry)),
					2000
				);
			}),
			title: PUBLISH_TEXT.taskRegistry
		}]),
		title: PUBLISH_TEXT.taskEnv
	}, {
		task: async(ctx, t) => {
			if (IsExist("node_modules")) return;
			const [err, res] = await AsyncTo(Execa.stdout("yarn", ["install"]));
			if (err || !res) {
				ctx.yarn = false;
				t.skip(PUBLISH_TEXT.errorYarnInstall);
			}
		},
		title: PUBLISH_TEXT.taskYarnInstall
	}, {
		enabled: ctx => ctx.yarn === false,
		task: async() => {
			if (IsExist("node_modules")) return;
			const [err, res] = await AsyncTo(Execa.stdout("npm", ["i"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorNpmInstall);
			}
		},
		title: PUBLISH_TEXT.taskNpmInstall
	}, {
		task: async() => {
			const [err, res] = await AsyncTo(Execa.stdout("npm", ["whoami"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorLogin);
			}
		},
		title: PUBLISH_TEXT.taskLogin
	}, {
		task: async() => {
			const [err, res] = await AsyncTo(Execa.stderr("npm", ["publish"]));
			if (err || !res) {
				throw new Error(PUBLISH_TEXT.errorPublish);
			}
		},
		title: PUBLISH_TEXT.taskPublish
	}]);
	const [err, res] = await AsyncTo(tasks.run());
	if (err || !res) {
		console.log(Chalk.redBright(PUBLISH_TEXT.publishFail));
	} else {
		const { name, version } = require(AbsPath("package.json"));
		console.log(Chalk.greenBright(PUBLISH_TEXT.publishSucceed(name, version)));
		console.log(Chalk.yellowBright(PUBLISH_TEXT.publishWarning));
	}
};