const Chalk = require("chalk");
const Execa = require("execa");
const Figures = require("figures");
const Listr = require("listr");

const { AsyncTo } = require("./index");

module.exports = async function() {
	let registry = "";
	const tasks = new Listr([{
		title: "Node环境检查",
		task: () => {
			return new Listr([{
				title: "检查Node是否安装",
				task: async() => {
					const res = await Execa.stdout("node", ["-v"]);
					if (!res) {
						throw new Error(Chalk.redBright("Node未安装"));
					}
				}
			}, {
				title: "检查Npm是否安装",
				task: async() => {
					const res = await Execa.stdout("npm", ["-v"]);
					if (!res) {
						throw new Error(Chalk.redBright("Npm未安装"));
					}
				}
			}, {
				title: "检查Npm镜像",
				task: async() => {
					const res = await Execa.stdout("npm", ["config", "get", "registry"]);
					if (res !== "https://registry.npmjs.org/") {
						await Execa.stdout("npm", ["config", "set", "registry", "https://registry.npmjs.org/"]);
						registry = res;
					}
				}
			}]);
		}
	}, {
		title: "使用Yarn安装模块依赖",
		task: async(ctx, t) => {
			const [err, res] = await AsyncTo(Execa("yarn", ["install"]));
			if (err || !res) {
				ctx.yarn = false;
				t.skip("Yarn未安装，请执行`npm i -g yarn`安装Yarn");
			}
		}
	}, {
		title: "使用Npm安装模块依赖",
		enabled: ctx => ctx.yarn === false,
		task: () => Execa("npm", ["i"])
	}]);
	const [err, res] = await AsyncTo(tasks.run());
	if (err || !res) {
		const exec1 = Chalk.blueBright("pkg-master publish");
		const exec2 = Chalk.blueBright("pkg-master p");
		console.log(Chalk.redBright(`${Figures.cross} 执行步骤出错，请根据提示修复再执行${exec1}或${exec2}`));
	} else {
		registry && await Execa.stdout("npm", ["config", "set", "registry", registry]);
		console.log(Chalk.greenBright(`${Figures.tick} 模块发布成功`));
	}
};