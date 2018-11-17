const Chalk = require("chalk");
const Execa = require("execa");
const Figures = require("figures");
const Listr = require("listr");

const { AsyncTo } = require("./index");

module.exports = async function() {
	const tasks = new Listr([{
		title: "检查Node运行环境",
		task: () => {
			return new Listr([{
				title: "检查Node是否安装",
				task: () => new Promise(async(resolve, reject) => {
					const res = await Execa.stdout("node", ["-v"]);
					setTimeout(() => res ? resolve("Node已安装") : reject(new Error("Node未安装")), 2000);
				})
			}, {
				title: "检查Npm是否安装",
				task: () => new Promise(async(resolve, reject) => {
					const res = await Execa.stdout("npm", ["-v"]);
					setTimeout(() => res ? resolve("Npm已安装") : reject(new Error("Npm未安装")), 2000);
				})
			}, {
				title: "检查Npm镜像",
				task: async() => new Promise(async(resolve, reject) => {
					const res = await Execa.stdout("npm", ["config", "get", "registry"]);
					setTimeout(
						() => res === "https://registry.npmjs.org/"
							? resolve("Npm镜像为源镜像")
							: reject(new Error("请执行`npm config set registry https://registry.npmjs.org/`切换回源镜像")),
						2000
					);
				})
			}]);
		}
	}, {
		title: "使用Yarn安装模块依赖",
		task: async(ctx, t) => {
			const [err, res] = await AsyncTo(Execa.stdout("yarn", ["install"]));
			if (err || !res) {
				ctx.yarn = false;
				t.skip("Yarn未安装，请执行`npm i -g yarn`安装Yarn");
			}
		}
	}, {
		title: "使用Npm安装模块依赖",
		enabled: ctx => ctx.yarn === false,
		task: () => Execa.stdout("npm", ["i"])
	}, {
		title: "查看Npm账号登录状态",
		task: async() => {
			const [err, res] = await AsyncTo(Execa.stdout("npm", ["whoami"]));
			if (err || !res) {
				throw new Error("请登录您的Npm账号");
			}
		}
	}, {
		title: "发布Npm模块",
		task: async() => {
			const [err, res] = await AsyncTo(Execa.stderr("npm", ["publish"]));
			if (err || !res) {
				throw new Error("模块已存在，请使用其他名称发布模块");
			}
		}
	}]);
	const [err, res] = await AsyncTo(tasks.run());
	if (err || !res) {
		const exec1 = Chalk.blueBright("pkg-master publish");
		const exec2 = Chalk.blueBright("pkg-master p");
		console.log(Chalk.redBright(`${Figures.cross} 执行步骤出错，请根据提示修复再执行${exec1}或${exec2}`));
	} else {
		console.log(Chalk.greenBright(`${Figures.tick} 模块发布成功`));
		console.log(Chalk.yellowBright(`${Figures.warning} 请执行${Chalk.blueBright("npm config set registry https://registry.npm.taobao.org/")}切换回淘宝镜像`));
	}
};