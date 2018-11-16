const Chalk = require("chalk");
const Execa = require("execa");
const Listr = require("listr");

module.exports = async function() {
	const task = [{
		title: "检查npm镜像是否是源镜像",
		task: (ctx, t) => {
			Execa.stdout("npm", ["config", "get", "registry"]).then(res => {
				console.log(res);
				if (res !== "https://registry.npmjs.org/") {
					t.skip(Chalk.redBright("源镜像出错"));
				}
			});
		}
	}, {
		title: "检查npm是哪个版本",
		task: () => {
			Execa.stdout("npm", ["-v"]).then(res => {
				console.log(res);
			});
		}
	}];
	new Listr(task).run();
};