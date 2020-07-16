const Chalk = require("chalk");

const { PUBLISH_TEXT } = require("../i18n");
const { PublishAnswer } = require("../pipe");
const { AbsPath } = require("../util/setting");

module.exports = async function() {
	const [err, res] = await PublishAnswer();
	if (err || !res) {
		console.log(Chalk.redBright(PUBLISH_TEXT.publishFailed));
	} else {
		const { name, version } = require(AbsPath("package.json"));
		const succMsg = Chalk.greenBright(PUBLISH_TEXT.publishSuccessed(name, version));
		const warnMsg = Chalk.yellowBright(PUBLISH_TEXT.publishWarning);
		console.log(succMsg);
		console.log(warnMsg);
	}
};