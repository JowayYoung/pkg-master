const Util = require("util");
const Chalk = require("chalk");
const Execa = require("execa");
const Listr = require("listr");

const { AsyncTo } = require("./index");

module.exports = async function() {
	const tasks = new Listr([{
		title: "Node环境检查",
		task: () => {
			return new Listr([{
				title: "检查Node是否安装",
				task: async() => {
					const res = await Execa.stdout("node", ["-v"]);
					if (!res) {
						throw new Error(Chalk.redBright("请检查是否安装Node"));
					}
				}
			}, {
				title: "检查Npm是否安装",
				task: async() => {
					const res = await Execa.stdout("npm", ["-v"]);
					if (!res) {
						throw new Error(Chalk.redBright("请检查是否安装Npm"));
					}
				}
			}, {
				title: "检查Npm镜像",
				task: async() => {
					const res = await Execa.stdout("npm", ["config", "get", "registry"]);
					if (res !== "https://registry.npmjs.org/") {
						throw new Error(Chalk.redBright("请切换回Npm源镜像：https://registry.npmjs.org/"));
					}
				}
			}]);
		}
	}, {
		title: "使用Yarn安装模块依赖",
		task: (ctx, task) => Execa("yarn").catch(() => {
			ctx.yarn = false;
			task.skip("Yarn没有安装，请执行 npm i -g yarn 安装Yarn");
		})
	}, {
		title: "使用Npm安装模块依赖",
		enabled: ctx => ctx.yarn === false,
		task: () => Execa("npm", ["install"])
	}]);
	const [err, stats] = await AsyncTo(tasks.run());
	console.log(err, stats);
};